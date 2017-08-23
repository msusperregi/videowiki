import * as Diff from 'diff' ;
import diff from 'deep-diff';
import { deleteAudios } from '../../utils'

const removeDeletedSlides = function( slides, removedSlidesArray, callback) {
    if(removedSlidesArray && removedSlidesArray.length > 0){
        const slidesText = slides.map( slide => slide.text ) ;
        // delete audio of removed slides
        var removedAudios = JSON.parse(JSON.stringify(removedSlidesArray));
        removedAudios = removedAudios.filter(slide => {return slide.audio;} ).map( slide => slide.audio.split('/')[3] );
        deleteAudios(removedAudios, (err, data) => {
            if(err) console.log(err);
            else {
                console.log('Audios Deleted Successfully! ', data);
            }
            // collect indices to be removed from slides
            var removedIndices = [] ;
            var removedSlidesBatch = removedSlidesArray.map(slide => slide.text);
            removedSlidesBatch.forEach( (slide) => removedIndices.push(slidesText.indexOf(slide)));

            // sort the indeces to be removed in ascending order 
            // to remove slides from the end of the array using removedIndices.pop()
            removedIndices.sort(function(a, b){ return a-b });
            // remove deleted slides from main slides array
            while(removedIndices.length){
                slides.splice(removedIndices.pop(), 1);
            }
            
            return callback(null, slides);
        });
    } else {
        return callback(null, slides);
    }
    
}

// gets the added slide with position from the original slides array fetched from wikipedia 
const getSlidesPosition = function(slides, slidesText) {
    var addedSlidesArray = [] ;

    if(Array.isArray(slidesText)){
        // filter the slides array and return only with text included in slidesText
        addedSlidesArray = slides.filter((slide) => {
            return slidesText.indexOf(slide.text) > -1;
        });
    }
    
    return addedSlidesArray;
}


// updated slides have position intersect between added and removed slides
const fetchUpdatedSlidesMeta = function(oldUpdatedSlides, addedSlidesArray, removedSlidesArray) {
    // var removedSlidesMap = {} ;
    var removedSlidesText = removedSlidesArray.map(slide => slide.text);
    var addedslidesText = addedSlidesArray.map(slide => slide.text);
    var oldUpdatedSlidesText = oldUpdatedSlides.map(slide => slide.text);
    var updatedslidesArray = [];

    addedslidesText.forEach( (addedSlide, index1) => {
        removedSlidesText.forEach( (removedSlide, index2) => {
            var removedslideArray = removedSlide.split(' ');
            var addedslideArray = addedSlide.split(' ');
            var diffs = diff(removedslideArray, addedslideArray);
            var editCount = 0;
            if(diffs) {
                diffs.forEach( (d, i) => { 
                    if(d.kind == 'E' && 
                      ( (diffs[i-1] && diffs[i-1].lhs != d.rhs) || (diffs[i+1] && diffs[i+1].rhs != d.lhs )) )
                        editCount ++ ;
                        
                    } );
                // if the difference of edit between two slides is < 70% of the old slide length
                // then it's the same slide, really!
                if((editCount / removedslideArray.length * 100) < 70 ) {
                    addedSlidesArray[index1].media = removedSlidesArray[index2].media; 
                    addedSlidesArray[index1].mediaType = removedSlidesArray[index2].mediaType; 
                    updatedslidesArray.push(addedSlidesArray[index1]);
                }

            } else { 
                // its exactly the same text!
                addedSlidesArray[index1].media = removedSlidesArray[index2].media; 
                addedSlidesArray[index1].mediaType = removedSlidesArray[index2].mediaType; 
                addedSlidesArray[index1].audio = removedSlidesArray[index2].audio; 
                updatedslidesArray.push(addedSlidesArray[index1]);
                // remove audio to protect it from being deleted
                removedSlidesArray[index2].audio = '';
                removedSlidesArray.splice(index2, 1,{});
            }
        })
    })

    return {addedSlidesArray, updatedslidesArray};

}

// gets the differences between two string arrays
const getDifferences = function( oldArray, newArray) {
        var diffs = Diff.diffArrays(oldArray, newArray);

        // Batch the removed and added slides
        var addedBatch = [];
        var removedBatch = [];
        diffs.forEach( difference => {
            if(difference.added) addedBatch = [ ...addedBatch, ...difference.value]
            if(difference.removed) removedBatch = [...removedBatch ,...difference.value ]
        });

        return { addedBatch, removedBatch };
}

// adds media for slides that doesn't have any
const addRandomMediaOnSlides = function(slides, addedSlidesArray) {
    const mediaArray = slides.filter(slide => slide.media ).map(slide => [slide.media, slide.mediaType] );
    const defaultMediaPath = '/img/upload-media.png';
    var randIndex ; 
    if(mediaArray && mediaArray.length > 0){
        // there's some media in the article !
        addedSlidesArray.forEach( slide => {
            // if there's no media on the added slide, generate random index and add random media 
            if(!slide.media) {
                randIndex = Math.floor(Math.random() * (mediaArray.length - 1));
                slide.media = mediaArray[randIndex][0];
                slide.mediaType = mediaArray[randIndex][1];
            }
        });   
    } else {
        // there's no media ! revert to default media link 
        addedSlidesArray.forEach( slide => {
            if(!slide.media) {
                slide.media = defaultMediaPath ;
                slide.mediaType = 'image';
            }
        });
    }

    return addedSlidesArray;
}


export {
    removeDeletedSlides,
    getSlidesPosition,
    fetchUpdatedSlidesMeta,
    getDifferences,
    addRandomMediaOnSlides
}