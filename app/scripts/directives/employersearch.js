'use strict';

/**
 * @ngdoc directive
 * @name employerSearchApp.directive:employerSearch
 * @description
 * # employerSearch
 */
angular.module('directives.employerSearch', [])
  .directive('employerSearch', function () {
    return {
      templateUrl: function(tElement,tAttrs){
          return tAttrs.templateUrl;
      },
      restrict: 'EAC',
      link: function postLink(scope, element, attrs) {
        var select2Element = element.children().get(0);
        $(select2Element).select2({
            minimumInputLength: attrs.minimumInputLength,
            maximumSelectionSize:attrs.maximumSelectionSize,
            multiple:true,
            id:function(obj){
              return obj.id;
            },
            ajax:{
              url : attrs.employerSearchServiceUrl,
              transport:function(queryParams){
                  $.ajax({
                      url: queryParams.url+'?q='+queryParams.data.q,
                      async:false,
                      headers: { 'Authorization': 'Bearer ' + keycloak.token }
                  }).done(function(results){
                      queryParams.success({results:results});
                  });

              },
              dataType: 'jsonp',
              data : function(term, page){
                  return {q:term} //search term
              },
              results:function(data,page,query)
              {
                  return data;
              }
            }
        });

        //What should happen on change
        $(select2Element).on("change", function(e){
            if(e.added)
            {
                scope.employers.push(e.added);
            }
            else if(e.removed)
            {
                var i = scope.employers.indexOf(e.removed);
                scope.employers.splice(i,1);
            }

        });
      }
    };
  });
