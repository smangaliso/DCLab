function zip(arrays) 
{
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}


function render_plots(x,y,title,xname,yname)
 {

    option = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'center',
        text: title,
        textStyle: {
                color: '#f8f8ff'
    },
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        },
        iconStyle: {
            borderColor: "rgba (255,255,255)",
    }
      },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel:{
            color:"#fffafa",
        },
        nameTextStyle: {
                color: "#fffafa",
                padding: [8, 8, 8, 8],
                fontWeight: "bold",
        },
        name: xname,
        nameLocation: "middle",
       
        data: x
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        axisLabel:{
            color:"#fffafa",
           
        },
        nameTextStyle: {
                color: "#fffafa",
                fontWeight: "bold",
                padding: [0, 0, 20, 0]
        },
        name: yname,
        nameLocation: "middle",
        nameGap: 25,
      
    },
    dataZoom: [
            {
                type: 'slider',
                show: true,
                start: 94,
                end: 100,
                handleSize: 8,
                bottom: "1%",
            },
            {
                type: 'inside',
                start: 94,
                end: 100
            },
           
        ],
    series: [
        {
            name: title,
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
                color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgb(255, 158, 68)'
                }, {
                    offset: 1,
                    color: 'rgb(255, 70, 131)'
                }])
            },
            data: y
        }
    ]
};

return option
    
}


function mapped_plots(mapped,title,xname,yname)
 {
    option = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'center',
        text: title,
        textStyle: {
                color: '#f8f8ff'
    },
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        },
        iconStyle: {
            borderColor: "rgba (255,255,255)",
    }
      },
    xAxis: {
        type: 'value',
        boundaryGap: false,
        axisLabel:{
            color:"#fffafa",
        },
        nameTextStyle: {
                color: "#fffafa",
                padding: [8, 8, 8, 8],
                fontWeight: "bold",
        },
        name: xname,
        nameLocation: "middle",
       
        
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        axisLabel:{
            color:"#fffafa",
           
        },
        nameTextStyle: {
                color: "#fffafa",
                fontWeight: "bold",
                padding: [0, 0, 20, 0]
        },
        name: yname,
        nameLocation: "middle",
        nameGap: 25,
      
    },
    dataZoom: [
            {
                type: 'slider',
                show: true,
                start: 94,
                end: 100,
                handleSize: 8,
                bottom: "1%",
            },
            {
                type: 'inside',
                start: 94,
                end: 100
            },
           
        ],
    series: [
        {
            name: title,
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
                color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgb(255, 158, 68)'
                }, {
                    offset: 1,
                    color: 'rgb(255, 70, 131)'
                }])
            },
            data: mapped
        }
    ]
};

return option


    
}