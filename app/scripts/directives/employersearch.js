'use strict';

/**
 * @ngdoc directive
 * @name employerSearchApp.directive:employerSearch
 * @description
 * # employerSearch
 */
angular.module('directives.employerSearch', [])
    .directive('employerSearch', function ($compile, $http, $templateCache) {
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

                            //What should happen on change
                            $(select2Element).on("change", function (e) {
                                if (e.added) {
                                    scope.employers.push(e.added);
                                }
                                else if (e.removed) {
                                    var i = scope.employers.indexOf(e.removed);
                                    scope.employers.splice(i, 1);
                                }

                            });



                        });
                }


            }
        };
    });
