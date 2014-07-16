'use strict';

/**
 * @ngdoc directive
 * @name employerSearchApp.directive:employerSearch
 * @description
 * # employerSearch
 */
angular.module('directives.employerSearch', ['services.employerSearchService'])
    .directive('employerSearch', function ($compile, $http, $templateCache, employerSearchFactory) {
        return {
            restrict: 'EAC',
            replace: true,
            link: function postLink(scope, element, attrs) {

                loadTemplate(attrs.templateUrl);

                function loadTemplate(template) {
                    $http.get(template, { cache: $templateCache })
                        .success(function (templateContent) {

                            var container = document.createElement("div");
                            $(container).html(templateContent);
                            element.replaceWith(container);

                            var select2Element = $(container).children().get(0);
                            $(select2Element).select2({
                                minimumInputLength: attrs.minimumInputLength,
                                maximumSelectionSize: attrs.maximumSelectionSize,
                                initSelection:function(element, callback){
                                    callback(scope.employers);
                                },
                                multiple: true,
                                id: function (obj) {
                                    return obj.id;
                                },
                                ajax: {
                                    url: attrs.employerSearchServiceUrl,
                                    transport: function (queryParams) {
                                        $.ajax({
                                            url: queryParams.url + '?q=' + queryParams.data.q,
                                            async: false,
                                            headers: { 'Authorization': 'Bearer ' + keycloak.token }
                                        }).done(function (results) {
                                            queryParams.success({results: results});
                                        });

                                    },
                                    dataType: 'jsonp',
                                    data: function (term, page) {
                                        return {q: term} //search term
                                    },
                                    results: function (data, page, query) {
                                        return data;
                                    }
                                }
                            });

                            $(select2Element).select2('val',scope.employers);

                            //What should happen on change
                            $(select2Element).on("change", function (e) {
                                if (e.added) {
                                    scope.employers.push(e.added);
                                    employerSearchFactory.save();
                                    scope.$apply();
                                }
                                else if (e.removed) {
                                    var i = scope.employers.indexOf(e.removed);
                                    scope.employers.splice(i, 1);
                                    employerSearchFactory.save();
                                    scope.$apply();
                                }

                            });



                        });
                }


            }
        };
    });
