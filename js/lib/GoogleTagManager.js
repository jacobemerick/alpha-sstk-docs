&lt;script id="script-analytics-js" type="text/javascript" src="js/lib/analytics.min.js"&gt;&lt;/script&gt;
&lt;script id="script-listener-js" type="text/javascript" src="js/lib/listener.min.js"&gt;&lt;/script&gt;

&lt;script&gt;
window.analyticsData = {
  page: {
    site: 'developers',
    applicationName: 'apigee',
    environment: 'production',
    pageType: 'apireference'
  },
  user: {
     id: '',
     isActive: 'false',
     creationDate: ''
  },
  visit: {
    visitId: '',
    visitorId: ''
  }
}
&lt;/script&gt;

&lt;script&gt;
(function initializeSegment() {
  window.analytics.initialize({
    'Google Tag Manager': {
        containerId: 'GTM-PFWDHP'
    }
  }, {
    initialPageview: {
        properties: window.analyticsData
    }
  });
}());
&lt;/script&gt;

&lt;script&gt;
window.AnalyticsListener.listen(function() {
  return JSON.parse(JSON.stringify(window.analyticsData));
});
&lt;/script&gt;
