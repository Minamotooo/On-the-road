import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "./App.css";
import Navbar from "../HomePage/Navbar";
import Sus from "./Sus";

function App() {
  const [data, setData] = useState([]);
  const [revenue, setRevenue] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/admin/dashboard`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const res = await response.json();
          setData(res.data);
        } else {
          console.log("Error fetching user data: ", response.statusText);
        }
      } catch (error) {
        console.log("Error fetching user data: ", error.message);
      }
    };

    const fetchRevenue = async () => {
      try {
        const response = await fetch(`http://localhost:4000/admin/revenue`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const res2 = await response.json();
          setRevenue(res2.data);
        } else {
          console.log("Error fetching revenue data: ", response.statusText);
        }
      } catch (error) {
        console.log("Error fetching revenue data: ", error.message);
      }
    };
    fetchRevenue();
    fetchData();
  }, []);

  const dates = data.map((item) => item.date);
  const bills = data.map((item) => item.bill);

  const months = revenue.map((item) => item.month_name);
  const monthlyRevenue = revenue.map((item) => item.revenue);

  const shouldRenderChart = dates.length > 0;
  const chartOptions = {
    colors: ["#E91E63", "#FF9800"],
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: dates,
    },
  };

  const chartSeries = [
    {
      name: "Transaction",
      data: bills,
    },
  ];

  const chartComponent = shouldRenderChart && (
    <Chart options={chartOptions} series={chartSeries} type="bar" width="600" />
  );

  console.log("Data State:", data);
  console.log("Revenue State:", revenue);

  const shouldRenderRevenue = months.length > 0 && monthlyRevenue.length > 0;

  const revenueOptions = {
    colors: ["#E91E63", "#FF9800"],
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: shouldRenderRevenue ? months : [],
    },
  };

  const revenueSeries = [
    {
      name: "Monthly Revenue",
      data: shouldRenderRevenue ? monthlyRevenue : [],
    },
  ];

  console.log("Revenue Options:", revenueOptions);
  console.log("Revenue Series:", revenueSeries);
  const RevenueChart = shouldRenderRevenue ? (
    <Chart
      options={revenueOptions}
      series={revenueSeries}
      type="line"
      width="600"
    />
  ) : (
    <div>No revenue data available.</div>
  );

  // Add an error check
  if (revenue.length === 0) {
    return <div>Error fetching revenue data.</div>;
  }

  console.log("Revenue Options:", revenueOptions);
  console.log("Revenue Series:", revenueSeries);

  console.log("Should Render Revenue:", shouldRenderRevenue);
  console.log("Revenue Chart:", RevenueChart);

  return (
    <div className="App">
      <Navbar />
      <h1>
        Admin Dashboard <i className="fas fa-user"></i>{" "}
      </h1>
      <div className="main--container">
        <div className="row">
          <h4>Amount of Transaction per month</h4>
          <br />
          <div className="col-4">{chartComponent}</div>
        </div>
        <div className="row">
          <h4>Revenue per month(5%)</h4>
          <br />
          <div className="col-4">{RevenueChart}</div>
        </div>
      </div>
      <Sus />
    </div>
  );
}

export default App;
