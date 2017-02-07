(function() {

  var module = angular.module('loom_comment_search_directive', []);

  module.directive('loomCommentSearch',
      function($rootScope, historyService, $translate, geogigService, diffService,
               pulldownService, dialogService, $window) {
        return {
          templateUrl: 'commentmoderation/partial/commentsearch.tpl.html',
          link: function(scope, element, attrs) {
            scope.startDate = [new Date().toISOString()];
            scope.endDate = [new Date().toISOString()];
            scope.active = true;
            scope.contentHidden = true;
            scope.isLoading = false;

            element.closest('.modal').on('hidden.bs.modal', function(e) {
              if (!scope.$$phase && !$rootScope.$$phase) {
                scope.$apply(function() {
                  scope.contentHidden = true;
                });
              } else {
                scope.contentHidden = true;
              }
            });
            element.closest('.modal').on('show.bs.modal', function(e) {
              if (!scope.$$phase && !$rootScope.$$phase) {
                scope.$apply(function() {
                  scope.contentHidden = false;
                });
              } else {
                scope.contentHidden = false;
              }
            });

            scope.cancel = function() {
              element.closest('.modal').modal('hide');
              scope.isLoading = false;
            };

            scope.onSearch = function() {
              scope.isLoading = true;
              var startTime = new Date(scope.startDate[0]).getTime();
              var endTime = new Date(scope.endDate[0]).getTime();
              //TODO: Remove
              console.log('Searching between', startTime, endTime);
            };

            //TODO: Make sure this works
            scope.exportCSV = function() {
              var repo = geogigService.getRepoById(historyService.layer.get('metadata').repoId);
              var startTime = new Date(scope.startDate[0]).getTime();
              var endTime = new Date(scope.endDate[0]).getTime();
              var untilTime = startTime < endTime ? endTime : startTime;
              var sinceTime = startTime < endTime ? startTime : endTime;
              var path = historyService.pathFilter;
              var until = historyService.layer.get('metadata').branchName;
              // TODO: Make this work with a proxy once it supports authentication
              var url = repo.url + '/log.csv?until=' + until + '&path=' +
                  path + '&sinceTime=' + sinceTime + '&untilTime=' + untilTime + '&summary=true';
              $window.open(url);
            };
          }
        };
      }
  );
})();
