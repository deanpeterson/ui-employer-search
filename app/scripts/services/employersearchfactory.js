'use strict';

/**
 * @ngdoc service
 * @name employerSearchApp.employerSearchFactory
 * @description
 * # employerSearchFactory
 * Factory in the employerSearchApp.
 */
angular.module('services.employerSearchService')
  .factory('employerSearchFactory', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

        var defaults = [];

        var service = {

            employers : [],
            save : function() {
                localStorage.presently = angular
                    .toJson(service.employers);
            },
            restore : function() {
                service.employers = angular
                    .fromJson(localStorage.presently)
                    || defaults;
                return service.employers;
            }
        };
        return service;
  });
