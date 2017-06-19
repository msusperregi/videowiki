import { mergeImmutable } from '../utils'
import actions from '../actions/ArticleActionCreators'

const initialState = {
  fetchArticleState: 'loading',
  article: null,
  topArticlesState: 'loading',
  topArticles: [],
  conversionPercentage: {},
  conversionPercentageState: 'loading',
  publishArticleState: 'done',
  publishArticleStatus: null,
  publishArticleError: null,
  fetchContributorsState: 'loading',
  fetchArticleCountState: 'loading',
  articleCount: 0,
  fetchAllArticlesState: 'loading',
  allArticles: [],
}

const handlers = {
  [actions.FETCH_ARTICLE_REQUEST]: (state) =>
    mergeImmutable(state, {
      fetchArticleState: 'loading',
      article: null,
    }),

  [actions.FETCH_ARTICLE_RECEIVE]: (state, action) =>
    mergeImmutable(state, {
      fetchArticleState: 'done',
      article: action.article,
    }),

  [actions.FETCH_ARTICLE_FAILED]: (state) =>
    mergeImmutable(state, {
      fetchArticleState: 'failed',
      article: null,
    }),

  [actions.UPLOAD_CONTENT_REQUEST]: (state) =>
    mergeImmutable(state, {
      uploadStatus: null,
    }),

  [actions.UPLOAD_CONTENT_RECEIVE]: (state, action) =>
    mergeImmutable(state, {
      uploadStatus: action.uploadStatus,
    }),

  [actions.UPLOAD_CONTENT_FAILED]: (state) =>
    mergeImmutable(state, {
      uploadStatus: null,
    }),

  // =============
  [actions.FETCH_TOP_ARTICLES_REQUEST]: (state) =>
    mergeImmutable(state, {
      topArticlesState: 'loading',
      topArticles: [],
    }),

  [actions.FETCH_TOP_ARTICLES_RECEIVE]: (state, action) =>
    mergeImmutable(state, {
      topArticlesState: 'done',
      topArticles: action.articles,
    }),

  [actions.FETCH_TOP_ARTICLES_FAILED]: (state, action) =>
    mergeImmutable(state, {
      topArticlesState: 'failed',
      topArticles: action.reason,
    }),

  // =============
  [actions.FETCH_CONVERSION_PROGRESS_REQUEST]: (state) =>
    mergeImmutable(state, {
      conversionPercentageState: 'loading',
    }),

  [actions.FETCH_CONVERSION_PROGRESS_RECEIVE]: (state, action) =>
    mergeImmutable(state, {
      conversionPercentage: action,
      conversionPercentageState: 'done',
    }),

  [actions.FETCH_CONVERSION_PROGRESS_FAILED]: (state) =>
    mergeImmutable(state, {
      conversionPercentageState: 'failed',
    }),

  // =============
  [actions.PUBLISH_ARTICLE_REQUEST]: (state) =>
    mergeImmutable(state, {
      publishArticleState: 'loading',
      publishArticleStatus: null,
      publishArticleError: null,
    }),

  [actions.PUBLISH_ARTICLE_RECEIVE]: (state, action) =>
    mergeImmutable(state, {
      publishArticleStatus: action,
      publishArticleState: 'done',
    }),

  [actions.PUBLISH_ARTICLE_FAILED]: (state, action) =>
    mergeImmutable(state, {
      publishArticleState: 'failed',
      publishArticleError: action.reason,
    }),

  // =============
  [actions.FETCH_CONTRIBUTORS_REQUEST]: (state) =>
    mergeImmutable(state, {
      fetchContributorsState: 'loading',
    }),

  [actions.FETCH_CONTRIBUTORS_RECEIVE]: (state, action) =>
    mergeImmutable(state, {
      fetchContributorsState: 'done',
      contributors: action.contributors,
    }),

  [actions.FETCH_CONTRIBUTORS_FAILED]: (state) =>
    mergeImmutable(state, {
      fetchContributorsState: 'failed',
    }),

  // ================
  [actions.RESET_PUBLISH_ERROR]: (state) =>
    mergeImmutable(state, {
      publishArticleStatus: null,
      publishArticleError: null,
      publishArticleState: 'done',
    }),

  // =============
  [actions.FETCH_ARTICLE_COUNT_REQUEST]: (state) =>
    mergeImmutable(state, {
      fetchArticleCountState: 'loading',
    }),

  [actions.FETCH_ARTICLE_COUNT_RECEIVE]: (state, action) =>
    mergeImmutable(state, {
      fetchArticleCountState: 'done',
      articleCount: action.count,
    }),

  [actions.FETCH_ARTICLE_COUNT_FAILED]: (state) =>
    mergeImmutable(state, {
      fetchArticleCountState: 'failed',
    }),

  // =============
  [actions.FETCH_ALL_ARTICLES_REQUEST]: (state) =>
    mergeImmutable(state, {
      fetchAllArticlesState: 'loading',
    }),

  [actions.FETCH_ALL_ARTICLES_RECEIVE]: (state, action) =>
    mergeImmutable(state, {
      fetchAllArticlesState: 'done',
      allArticles: action.articles,
    }),

  [actions.FETCH_ALL_ARTICLES_FAILED]: (state) =>
    mergeImmutable(state, {
      fetchAllArticlesState: 'failed',
    }),
}

export default (reducer) =>
  (state = initialState, action) =>
    reducer(handlers, state, action)
