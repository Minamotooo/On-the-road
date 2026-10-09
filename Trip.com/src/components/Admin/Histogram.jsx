import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Navbar from "../HomePage/Navbar";
import { API, SectionHead, postJSON, taka } from "../Shared/ui";
import AddTouristSpot from "./AddTouristSpot";
import Deleted from "./Deleted";
import LogTable from "./LogTable";
import Sus from "./Sus";

const NAVY = "#112B3C";
const PINK = "#E61C5D";

const baseChart = {
  chart: { toolbar: { show: false }, fontFamily: "Jost, sans-serif" },
  grid: { borderColor: "#eeeeee", strokeDashArray: 4 },
  dataLabels: { enabled: false },
  yaxis: { labels: { formatter: (v) => taka(v) } },
  tooltip: { y: { formatter: (v) => taka(v) } },
};

export default function Histogram() {
  const [data, setData] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [dashboard, monthly] = await Promise.all([
          postJSON(`${API}/admin/dashboard`),
          postJSON(`${API}/admin/revenue`),
        ]);
        if (dashboard.ok) setData((await dashboard.json()).data);
        if (monthly.ok) setRevenue((await monthly.json()).data);
        if (!dashboard.ok || !monthly.ok) setError("Some dashboard data could not be loaded.");
      } catch (err) {
        setError(`Error fetching dashboard data: ${err.message}`);
      }
    };
    load();
  }, []);

  const months = data.map((item) => item.date.trim().slice(0, 3));
  const bills = data.map((item) => Number(item.bill));
  const revenueMonths = revenue.map((item) => item.month_name.slice(0, 3));
  const monthlyRevenue = revenue.map((item) => Number(item.revenue));

  const totalBookings = bills.reduce((a, b) => a + b, 0);
  const totalRevenue = monthlyRevenue.reduce((a, b) => a + b, 0);
  const bestMonth = revenue.reduce((best, r) => (!best || Number(r.revenue) > Number(best.revenue) ? r : best), null);

  return (
    <div className="otr-page">
      <Navbar />
      <section className="otr-wrap otr-hero" style={{ paddingBottom: 0 }}>
        <div className="otr-hero__text" style={{ maxWidth: "none" }}>
          <p className="otr-kicker">Admin</p>
          <h1 className="otr-hero__title">Behind the scenes.</h1>
          <p className="otr-hero__sub">Bookings, revenue and the people keeping On the road honest.</p>
          <button className="otr-btn" onClick={() => setIsModalOpen(true)}>
            Add tourist spot
          </button>
        </div>
      </section>

      <div className="otr-wrap">
        {error && <p className="otr-note">{error}</p>}

        <section className="otr-section">
          <div className="otr-grid">
            <div className="otr-panel">
              <span className="otr-facts__label otr-muted">Booking value this year</span>
              <h3 style={{ fontSize: 30, margin: "6px 0 0" }}>{taka(totalBookings)}</h3>
            </div>
            <div className="otr-panel">
              <span className="otr-facts__label otr-muted">Our 5% commission</span>
              <h3 style={{ fontSize: 30, margin: "6px 0 0", color: PINK }}>{taka(totalRevenue)}</h3>
            </div>
            <div className="otr-panel">
              <span className="otr-facts__label otr-muted">Best month</span>
              <h3 style={{ fontSize: 30, margin: "6px 0 0" }}>{bestMonth ? bestMonth.month_name : "—"}</h3>
            </div>
          </div>
        </section>

        <section className="otr-section">
          <div className="otr-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))" }}>
            <div className="otr-panel">
              <SectionHead kicker="Bookings" title="Transactions per month" small />
              {months.length > 0 ? (
                <Chart
                  type="bar"
                  height={300}
                  options={{
                    ...baseChart,
                    colors: [NAVY],
                    plotOptions: { bar: { borderRadius: 6, columnWidth: "55%" } },
                    xaxis: { categories: months },
                  }}
                  series={[{ name: "Transactions", data: bills }]}
                />
              ) : (
                <p className="otr-empty">No bookings yet this year.</p>
              )}
            </div>
            <div className="otr-panel">
              <SectionHead kicker="Revenue" title="Commission per month (5%)" small />
              {revenueMonths.length > 0 ? (
                <Chart
                  type="area"
                  height={300}
                  options={{
                    ...baseChart,
                    colors: [PINK],
                    stroke: { curve: "smooth", width: 3 },
                    fill: { type: "gradient", gradient: { opacityFrom: 0.35, opacityTo: 0.02 } },
                    markers: { size: 4 },
                    xaxis: { categories: revenueMonths },
                  }}
                  series={[{ name: "Revenue", data: monthlyRevenue }]}
                />
              ) : (
                <p className="otr-empty">No revenue data available.</p>
              )}
            </div>
          </div>
        </section>

        <Sus />
        <Deleted />
        <LogTable />
      </div>

      {isModalOpen && <AddTouristSpot onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
