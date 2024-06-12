import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const GenderDistributionChart = () => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        // Fetch gender distribution data from the backend
        axios.get('http://localhost:3000/auth/genderdistribution')
            .then(response => {
                const data = response.data.Result;
                setChartData({
                    labels: ['Male', 'Female', ],
                    datasets: [
                        {
                            label: 'Gender Distribution',
                            data: [data.male, data.female, data.other],
                            backgroundColor: [
                                '#0a2351',
                                '#7C0A02',
                                
                            ],
                            hoverBackgroundColor: [
                                '#004792',
                                '#B31B1B',
                                
                            ]
                        }
                    ]
                });
            })
            .catch(error => {
                console.error('There was an error fetching the gender distribution data!', error);
            });
    }, []);

    return (
        <div>
            <h3 className="text-xl font-semibold text-center">Members</h3>
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

export default GenderDistributionChart;
