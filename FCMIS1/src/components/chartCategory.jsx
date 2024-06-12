import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryDistributionChart = () => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        // Fetch category distribution data from the backend
        axios.get('http://localhost:3000/auth/categorydistribution')
            .then(response => {
                const data = response.data.Result;
                setChartData({
                    labels: ['Muscle Building', 'Strength', 'Cardio', 'Crossfit', 'Flexibility'],
                    datasets: [
                        {
                            label: 'Category Distribution',
                            data: [
                                data.muscleBuilding, 
                                data.strength, 
                                data.cardio, 
                                data.crossfit, 
                                data.flexibility
                            ],
                            backgroundColor: [
                                '#36A2EB',
                                '#FF6384',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF'
                            ],
                            hoverBackgroundColor: [
                                '#36A2EB',
                                '#FF6384',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF'
                            ]
                        }
                    ]
                });
            })
            .catch(error => {
                console.error('There was an error fetching the category distribution data!', error);
            });
    }, []);

    return (
        <div>
            <h3 className="text-xl font-semibold text-center">Category</h3>
            {chartData.datasets ? (
                <Pie data={chartData} options={{
                    plugins: {
                        legend: {
                            labels: {
                                usePointStyle: true
                            }
                        }
                    }
                }} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default CategoryDistributionChart;
