$(document).on('click', '#clear-search', function() {
  $('#input-search').val('');
  $('.search-results').removeClass('visible');
});

$(document).on('click', '.toggleButton', function(e) {
  e.preventDefault();

  const $this = $(this);
  const $thisRow = $this.closest('.bodyParamRow');
  const $thisLevel = $thisRow.attr('level');

  const $nextUntilSelector = "[level='"+$thisLevel+"']";
  const $followingSiblingsOnHigherLevel = $thisRow.nextUntil($nextUntilSelector);

  if ($this.hasClass('active')){
    // deactivate children
    $followingSiblingsOnHigherLevel.removeClass("show");
  } else {
    //activate children
    const $levelToActivate = Number($thisLevel) + 1;
    const $levelToActivateSelector = "[level='" + $levelToActivate + "']";
    $followingSiblingsOnHigherLevel.filter($levelToActivateSelector).addClass('show');
    //set toggle buttons to inactive
    $followingSiblingsOnHigherLevel.children('.toggleButtonCell').children('a.toggleButton').removeClass('active');
  }
  $this.toggleClass('active');

});

$(window).on('resize', function() {
  var scrollTo = window.location.href.split('#')[1];
  if (!!scrollTo) {
    document.getElementById(scrollTo).scrollIntoView();
  }
});

$(document).ready(function() {
  var modifyUrlObserver = new IntersectionObserver(function(e) {
    if (e[0] && e[0].target) {
      var path = window.location.href.split('#')[0];
      var target = e[0].target;
      var intersectionRatio = e[0].intersectionRatio;

      if (intersectionRatio > 0) {
        window.history.replaceState({}, '', path + '#' + target.id);
      }
    }
  }, {
    threshold: 0.5
  });

  document.querySelectorAll('h1').forEach(t => modifyUrlObserver.observe(t));
  document.querySelectorAll('h2').forEach(t => modifyUrlObserver.observe(t));
  document.querySelectorAll('h3').forEach(t => modifyUrlObserver.observe(t));
});
