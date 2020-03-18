'use strict';

var searchResults;
var searchDelay = 1000;
var termTrackDelay = 2000;
var searchTimeoutHandle = 0;
var trackTimeoutHandle = 0;
// eslint-disable-next-line no-use-before-define
var $ = $;
// eslint-disable-next-line no-undef
var index = elasticlunr(function () {
  this.addField('title');
  this.addField('body');
  this.setRef('id');
});

/**
 * Parses through all of the index.html and extracts only relevant information that we then store
 * in documents that can be easily searched through.
 */
function populate() {
  $('h3, h2, h1')
    .each(function () {
      const title = $(this);
      var body = '';

      if (title.is('h3')) {
        body = title.nextUntil('h4');
      }
      if (title.is('h2')) {
        if (title.next()
          .is('h3')) {
          return;
        } else {
          body = title.nextUntil('h2');
        }
      }
      if (title.is('h1')) {
        body = title.nextUntil('h2');
      }

      // removes irrelevant information such as code examples from our documents.
      body = body.not('pre');

      const document =
        {
          id: title.prop('id'),
          title: title.text(),
          body: body.text()
        };
      index.addDoc(document);
    });
}

function reduceSchemaWeight(obj) {
  if (obj.doc.id.includes('schema')) obj.score *= 0.5;
  return obj;
}

/**
 * Searches through the list of indexed documents and then renders the results on the DOM.
 * @param event
 */
function search(event) {
  var searchInput = $('#input-search')[0];
  searchResults.addClass('visible');

  // ESC clears the field
  if (event.keyCode === 27) searchInput.value = '';

  if (searchInput.value) {
    var results = index.search(searchInput.value,
      {
        fields: {
          title: { boost: 2 },
          body: { boost: 1 }
        }
      });

    results = results
      .filter(score => (results.length > 5 ? score.score > 1 : score.score > 0))
      .map(reduceSchemaWeight)
      .sort((a, b) => b.score - a.score);

    if (results.length) {
      searchResults.empty();
      // eslint-disable-next-line no-shadow
      $.each(results, (i, result) => {
        // eslint-disable-next-line no-undef
        var elem = document.getElementById(result.ref);
        searchResults.append('<li><a href=\'#' + result.ref + '\'>' + $(elem)
          .text() + '</a></li>');
      });
    } else {
      searchResults.html('<li></li>');
      $('.search-results li')
        .text('No Results Found for "' + searchInput.value + '"');
    }

    var trackWait = function (executingFunction, waitTime, hasResults) {
      clearTimeout(trackTimeoutHandle);
      trackTimeoutHandle = setTimeout(() => executingFunction(hasResults), waitTime);
    };
    trackWait((hasResults) => {
      const searchText = $('#input-search').val();
      if (searchText.length > 2) {
        window.analytics.track("searchResults", {
          searchContext: {
            searchType: "API reference search",
            terms: searchText,
            hasResults: hasResults
          }
        });
      }
    }, termTrackDelay, results.length ? "true" : "false");

  } else {
    searchResults.removeClass('visible');
  }
}

/**
 * Creates an event listener so that when a user searches it will fire a search event.
 */
function bind() {
  searchResults = $('.search-results');

  $('#input-search')
    .on('keyup', (e) => {
      var searchWait = function (executingFunction, waitTime) {
        clearTimeout(searchTimeoutHandle);
        searchTimeoutHandle = setTimeout(executingFunction, waitTime);
      };
      searchWait(() => {
        search(e);
      }, searchDelay);
    });
}

$(document).ready(function(){
  $('#input-search').off('keyup'); // unbind default event set by shins.
  $(populate);
  $(bind);
});
