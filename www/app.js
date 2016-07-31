var wordList = angular.module('wordList', ['ngRoute', 'ngAnimate', 'ngDropdowns']);



//controllers
wordList.controller('entryController', function($scope, $rootScope){
    
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });
 
});


wordList.controller('optionsController', function($scope, $rootScope, $compile){
    
    $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
    });
    
    $scope.choosenRadio = 1;
    
    //radio option
    $scope.RadioChange = function(value) {
        if(value == 'group'){
            $scope.choosenRadio = 1;
        }else if(value == 'pair'){
            $scope.choosenRadio = 0;
        }
        
    };
    
    
    //custom angular select
    $scope.ddSelectOptions = [
        {
            text: 'Word list 1',
            value: 1
        },
        {
            text: 'Word list 2',
            value: 2
        }
    ];

    $scope.ddSelectSelected = {
        text: 'Word list 1',
        value: 1
    }; 
    
    
    //words to array
    $rootScope.pairsArr = [];
    $rootScope.pairId = 0;
    $rootScope.clearedArr;
    
    $scope.addPairs = function($event, pair){
        if(pair.first == null || pair.second == null) return false;
        $scope.cPair = pair;
        $scope.cPair.id = $rootScope.pairId;
        $rootScope.pairsArr.push($scope.cPair); 
        var addedPairs = angular.element('.wl-added-pairs');
        var newDirective = angular.element('<div words-pair class="added-pair" info="pairsArr[cPair.id]"></div>');

        $compile(newDirective)($scope);
        
        addedPairs.append(newDirective);
        $scope.pair = '';
        $rootScope.pairId += 1;
        
        //deleting element and word pair in pairs object
        $rootScope.clearedArr = $rootScope.pairsArr.filter(function(el) {
            // keep element if it's not an object, or if it's a non-empty object
            return typeof el != "object" || Array.isArray(el) || Object.keys(el).length > 0;
        });
    };
        
    
    //lists of words
    $rootScope.wordLists = {};
    $scope.saveList = function(){
        $rootScope.wordLists.name = $rootScope.pairsArr;
        localStorage["wordLists"] = JSON.stringify($rootScope.wordLists);
    };
 
});


//route provider
wordList.config(function ($routeProvider, $locationProvider) {
    
    $routeProvider
    .when('/', {
        templateUrl: 'pages/entrance.html',
        controller: 'entryController',
        animation: 'fadeIn'
    })
    
    .when('/options', {
        templateUrl: 'pages/options.html',
        controller: 'optionsController',
        animation: 'fadeIn'
    });
    
});


//directives
wordList.directive('wordsPair', function($rootScope){
    return {
        restrict: 'AEC',
        scope: { dirPair: '=info' },
        templateUrl: 'directives/single-pair.html',
        link: function (scope, element) {
            scope.firstWord = scope.dirPair.first;
            scope.secondWord = scope.dirPair.second;
            scope.pairId = scope.dirPair.id;

            element.on('click', '.close', function() {
                element.remove();
                scope.$destroy();
                
                //remove words pair from main array
                removePair($rootScope.pairsArr, scope.pairId);
                $rootScope.clearedArr = $rootScope.pairsArr.filter(function(el) {
                    // keep element if it's not an object, or if it's a non-empty object
                    return typeof el != "object" || Array.isArray(el) || Object.keys(el).length > 0;
                });
                
                console.log($rootScope.clearedArr);
            });
            
            
            function removePair(arr, value) {
              var o;

              for (var i=0; i<arr.length; i++) {
                o = arr[i];

                for (var p in o) {
                  if (o.hasOwnProperty(p) && o[p] == value) {
                    //arr.splice(i, 1);
                      delete arr[i];
                  }
                }
              
              }
            }
            
        }
    };
});