import React, { Component } from "react";
import { Route, Link, withRouter } from "react-router-dom";
import { fetchStationData } from "../services/users-helpers";
import CommentList from "./CommentList";
import ReactChartkick, { LineChart } from "react-chartkick";

class StationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stationData: [],
      chartData: []
    };
    this.compileChartData = this.compileChartData.bind(this);
    this.fetchStationData = this.fetchStationData.bind(this);
    this.createStationId = this.createStationId.bind(this);
  }

  createStationId() {
    const path = this.props.location.pathname.split("/")[2];
    return this.props.currentStation.id || path || "188";
  }
  async fetchStationData() {
    const station_id = parseInt(this.createStationId());
    const stationData = await fetchStationData(station_id);
    this.setState((prevState, newState) => ({
      stationData: stationData
    }));
    if (this.state.stationData.length) {
      this.compileChartData();
    }
  }

  compileChartData() {
    const chartData = this.state.stationData.map((data, el) => [
      //   data.label,
      //   data.average
    ]);
    this.setState((prevState, newState) => ({
      chartData: chartData
    }));
    console.log("chartData", chartData);
  }

  async componentDidMount() {
    await this.fetchStationData;
  }
  render() {
    const { currentStation } = this.props;
    const lineChart = (
      <div>
        <LineChart
          data={this.state.chartData}
          title={this.createStationId()}
          min={null}
          max={null}
          width={"800px"}
          height={"400px"}
          hAxis={"Time"}
          vAxis={"Busy"}
        />
      </div>
    );
    console.log("STATIONPAGE currentStation", currentStation);
    return (
      <>
        <h1>This is station name:{currentStation.name}</h1>
        <h2>{currentStation.lines}</h2>
        <button
          className="station-button"
          onClick={() =>
            this.props.history.push(`/station/${currentStation.id}/new-comment`)
          }
        >
          Comment
        </button>
        <button className="station-button">Favorite</button>
        {/* <div className="chart-container">{lineChart}</div> */}
        <CommentList />
      </>
    );
  }
}
export default withRouter(StationPage);
