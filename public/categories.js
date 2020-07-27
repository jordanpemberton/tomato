// Chart Elements:
const barChart = document.querySelector('#chart1').getContext('2d');
const pieChart = document.querySelector('#chart2').getContext('2d');

const colorPalette = [  '#d62d20', '#ff5400', '#80b918', '#008744', '#02c39a', '#2a9d8f', '#5f0f40', 
                        '#e63946', '#390099', '#ffa700', '#ff0054', '#25badf', '#ef6412', '#55006a', '#0057e7' ];

// Get categories and Times (dummy data):
let categories = ['Homework', 'Fun', 'Projects', 'Study', 'Research', 'Essay', 'CS361', 'Reading', 'Work', 'Git', 'CS340'];
let categoryMins = [55, 23, 60, 55, 25, 60, 59, 55, 33, 11, 78];

// Pick Colors:
let {transpColors, solidColors} = assignColors(categoryMins.length);

// Make Color Palletes:
function assignColors(dataLen) {
    let transpColors = [];
    let solidColors = [];
    let pLen = colorPalette.length;
    for (i=0; i<dataLen; i++) {
        let transpColor = colorPalette[i%pLen] + '74';
        let solidColor = colorPalette[i%pLen];
        transpColors.push(transpColor); 
        solidColors.push(solidColor);
    }
    return {transpColors, solidColors};
}


function makeBarChart(canvas) {
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                data: categoryMins,
                backgroundColor: transpColors,
                borderColor: solidColors,
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Minutes'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    });
}

function makeDoughnutChart(canvas) {
    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: categoryMins,
                backgroundColor: solidColors
            }]
        },
        options: { 
            cutoutPercentage: 35,
            legend: {
                display: true,
                position: 'right',
                align: 'right',
    
                labels: {
                    boxWidth: 12
                }
            }
        }
    });
}


makeBarChart(barChart);
makeDoughnutChart(pieChart);


  
