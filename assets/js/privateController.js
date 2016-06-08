(function () {
    'use strict';

    angular.module('privateProductDetailApp', ['highcharts-ng'])
        .controller('PrivateProductDetailController', function ($scope, $http, $location, $element, $window, $q, $interval) {

            // var vm = this;
            
        })
  

        //图表数据请求处理
        .service('myChartService', ['$http', '$q', function ($http, $q) {
            return {
                getData: function (params) {
                    var deferred = $q.defer();
                    var promise = $http.get("js/private.json?month=" + params);
                    promise.then(
                        // 通讯成功的处理
                        function (answer) {
                            // answer.status = true;
                            deferred.resolve(answer);
                        },
                        // 通讯失败的处理
                        function (error) {
                            // error.status = false;
                            deferred.reject(error);
                        });
                    return promise;
                }
            }
        }])

        //单位净值走势
        .directive('myChart', ['myChartService', function (myChartService) {
            return {
                restrict: "AE",
                link: function (scope, element,attr) {

                    console.log(attr);
                    
                    scope.month = element.attr('data-month');

                    //TAB选择
                    element.find("dd").on("click", function () {
                        angular.element(this).parent(".high-chart-tabs").find("dd").removeClass("active");
                        angular.element(this).addClass('active');
                        scope.month = angular.element(this).attr("data-month");
                        scope.getChartData(scope.month);
                        scope.fnConfig();
                        scope.$apply();
                    });

                    //获取图表数据
                    scope.getChartData = function (params) {
                        myChartService.getData(params).then(
                            function (answer) {
                                scope.data = answer;
                                console.log(answer);
                                scope.chartData = answer.data.chartData;
                                scope.chartDate = answer.data.chartDate;
                                scope.fnConfig();
                            },
                            function (error) {
                                scope.error = error;
                                console.log(error);
                            }
                        )
                    };

                    //chart Config
                    scope.fnConfig = function () {
                        scope.tickLine = scope.chartData.length - 1;
                        scope.chartConfig = {
                            options: {
                                chart: {
                                    type: 'spline'
                                },
                                colors: ['#058DC7'],
                                tooltip: {
                                    style: {
                                        padding: 10,
                                        fontWeight: 'bold'
                                    },
                                    crosshairs: {
                                        width: 1,
                                        color: "#db5050"
                                    },
                                    formatter: function () {
                                        return this.x + '<br/>' + this.series.name + ':' + Highcharts.numberFormat(this.y, 4, '.');
                                    }
                                }
                            },
                            title: {
                                text: '',
                                align: 'left',
                                x: 70
                            },
                            loading: false,
                            func: function (chart) {
                                scope.$evalAsync(function () {
                                    chart.reflow();
                                });
                            },
                            series: [{
                                name: ['单位净值'],
                                marker: {
                                    symbol: 'diamond'
                                },
                                data: scope.chartData
                            }],
                            xAxis: {
                                title: {
                                    text: ''
                                },
                                tickInterval: scope.tickLine,
                                tickWidth: 1,
                                gridLineWidth: 1,
                                labels: {
                                    align: 'center',
                                    x: 5,
                                    y: 15
                                },
                                categories: scope.chartDate
                            },

                            yAxis: [{
                                title: {
                                    text: null
                                },
                                labels: {
                                    align: 'left',
                                    x: -10,
                                    y: 16,
                                    format: '{value:.,0f}'
                                },
                                showFirstLabel: false
                            }, {
                                linkedTo: 0,
                                gridLineWidth: 0,
                                opposite: true,
                                title: {
                                    text: null
                                },
                                labels: {
                                    align: 'right',
                                    x: 10,
                                    y: 16,
                                    format: '{value:.,0f}'
                                },
                                showFirstLabel: false
                            }],
                            credits: {
                                enabled: false
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                spline: {
                                    marker: {
                                        enabled: false
                                    }
                                }
                            }
                        }
                    };

                    //初始化数据
                    scope.getChartData(scope.month);
                }
            };
        }
        ])

})();