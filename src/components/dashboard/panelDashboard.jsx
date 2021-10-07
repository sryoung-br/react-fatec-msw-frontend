import React from 'react';

import './panelDashboard.css';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import am4themes_dark from "@amcharts/amcharts4/themes/dark"

import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Collapse,
  Navbar,
  Container,
  Row,
  Col,
  Nav,
  NavItem,
} from 'reactstrap';


const URL_API = 'https://python-fatec-msw-backend.herokuapp.com/'

class PanelDashboard extends React.Component {

    /**
     * Construtor do Componente
     */
    constructor() {
      super();
      this.state = {
          title : "",
          displayCharts : "block",
          displayLoader : "none",
          displayBtnMa: "none",
          displayMa: "none",

          covid : {
            country : "",
            top : 5,
            start : "",
            end : "",
            window : 7,
          },

          countries : []

      };
      am4core.useTheme(am4themes_dark);
    }
    

    /**
     * Atualiza estado do objeto
     * @param {*} name 
     * @param {*} event 
     */
    updateInputValue = (name, event) => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;

      let covid = this.state.covid;
      covid[name] = value;

      this.setState({covid: covid});

      if(this.state.covid.country === ''){
        this.setState({displayBtnMa : "none"});
      }
      else{
        this.setState({displayBtnMa : "block"});
      }
   }

   countries(){
    
    let that = this

    let url_resource = URL_API+'api/v1/fatec/covid/countries'
    
    fetch(url_resource)
       .then(response => response.json())
       .then(result => {
        
        that.setState({countries : result.countries})

       })
       .catch(error => {
         console.log('error', error)
       });
   }
    /**
     * Método Assíncrono para leitura dos dados da Covid
     */
    asyncCovidData(){

      var that = this;

      that.setState({displayCharts : "none", displayLoader: "block"});

      let requestOptions = {
        method: 'GET'
      };
      
      let url_resource = URL_API+'api/v1/fatec/covid/status?'
      let country = this.state.covid.country
      let start = this.state.covid.start
      let end = this.state.covid.end

      setTimeout(() => {
        
        fetch(url_resource+"start="+start+"&end="+end+"&country="+country, requestOptions)
        .then(response => response.json())
        .then(result => {
          
          that.setState({displayCharts : "block", displayMa : "none", displayLoader: "none"})
          that.createCovidConfirmedChart(result);
          that.createCovidDeathsChart(result);
          that.createCovidActivesChart(result);
          that.createCovidRecoveredsChart(result);

        })
        .catch(error => {
          console.log('error', error)
          that.setState({displayCharts : "none", displayLoader: "none"})
        });

      }, 2000);
    }

    asyncMovingAverage(){

      var that = this;

      that.setState({displayCharts : "none", displayLoader: "block"});

      let requestOptions = {
        method: 'GET'
      };
      
      let url_resource = URL_API+'api/v1/fatec/moving/average?'
      let country = this.state.covid.country
      let start = this.state.covid.start
      let end = this.state.covid.end
      let window = this.state.covid.window

        
      fetch(url_resource+"start="+start+"&end="+end+"&country="+country+"&window="+window, requestOptions)
      .then(response => response.json())
      .then(result => {
        
        if(result.error){
          return console.log(result.error)
        }
        that.setState({displayCharts : "none", displayMa : "block", displayLoader: "none"})
        that.createMovingAverageChart(result);

      })
      .catch(error => {
        console.log('error', error)
        that.setState({displayCharts : "none", displayMa : "none", displayLoader: "none"})
      });
    }

    /**
     * Método para criação do Gráfico em tempo de Execução
     * Convid - Confirmados
     */
     createCovidConfirmedChart(responseApiDataSet){

      //Instancia o tipo do gráfico
      let chart = am4core.create("divChartCovidConfirmedDashboard", am4charts.PieChart);
      

      //Adiciona DataSet
      chart.data = responseApiDataSet.confirmed.slice(0,this.state.covid.top);

      //Definição do Raio Interno do Gráfico
      chart.innerRadius = am4core.percent(50);
      
      //Configura Séries
      var pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "value";
      pieSeries.dataFields.category = "country";

      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.labels.template.maxWidth = 130;
      pieSeries.labels.template.wrap = true;
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;

      pieSeries.colors.list = [
        am4core.color("#2d5ff5"),
        am4core.color("#20b2aa"),
        am4core.color("#4040ff")
      ];


      var rgm = new am4core.RadialGradientModifier();
      rgm.brightnesses.push(-0.8, -0.8, -0.5, 0, - 0.5);
      pieSeries.slices.template.fillModifier = rgm;
      pieSeries.slices.template.strokeModifier = rgm;
      pieSeries.slices.template.strokeOpacity = 0.4;
      pieSeries.slices.template.strokeWidth = 0;

      chart.legend = new am4charts.Legend();
      chart.legend.position = "bottom";

      this.chartCovidConfirmed = chart;
    }



    /**
     * Método para criação do Gráfico em tempo de Execução
     * Convid - Mortes
     */
     createCovidDeathsChart(responseApiDataSet){

      //Instancia o tipo do gráfico
      let chart = am4core.create("divChartCovidDeathsDashboard", am4charts.PieChart);
      

      //Adiciona DataSet
      chart.data = responseApiDataSet.deaths.slice(0,this.state.covid.top);

      //Definição do Raio Interno do Gráfico
      chart.innerRadius = am4core.percent(50);
      
      //Configura Séries
      var pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "value";
      pieSeries.dataFields.category = "country";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.labels.template.maxWidth = 130;
      pieSeries.labels.template.wrap = true;
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;

      pieSeries.colors.list = [
        am4core.color("#F20530"),
        am4core.color("#A60303"),
        am4core.color("#F22E62")
      ];


      var rgm = new am4core.RadialGradientModifier();
      rgm.brightnesses.push(-0.8, -0.8, -0.5, 0, - 0.5);
      pieSeries.slices.template.fillModifier = rgm;
      pieSeries.slices.template.strokeModifier = rgm;
      pieSeries.slices.template.strokeOpacity = 0.4;
      pieSeries.slices.template.strokeWidth = 0;

      chart.legend = new am4charts.Legend();
      chart.legend.position = "bottom";

      this.chartCovidDeaths = chart;
    }

    createCovidActivesChart(responseApiDataSet){

      //Instancia o tipo do gráfico
      let chart = am4core.create("divChartCovidActivesDashboard", am4charts.PieChart);
      

      //Adiciona DataSet
      chart.data = responseApiDataSet.active.slice(0,this.state.covid.top);

      //Definição do Raio Interno do Gráfico
      chart.innerRadius = am4core.percent(50);
      
      //Configura Séries
      var pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "value";
      pieSeries.dataFields.category = "country";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.labels.template.maxWidth = 130;
      pieSeries.labels.template.wrap = true;
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;

      pieSeries.colors.list = [
        am4core.color("#e5fe00"),
        am4core.color("#febf19"),
        am4core.color("#d98419")
      ];


      var rgm = new am4core.RadialGradientModifier();
      rgm.brightnesses.push(-0.8, -0.8, -0.5, 0, - 0.5);
      pieSeries.slices.template.fillModifier = rgm;
      pieSeries.slices.template.strokeModifier = rgm;
      pieSeries.slices.template.strokeOpacity = 0.4;
      pieSeries.slices.template.strokeWidth = 0;

      chart.legend = new am4charts.Legend();
      chart.legend.position = "bottom";

      this.chartCovidActives = chart;
    }

    createCovidRecoveredsChart(responseApiDataSet){

      //Instancia o tipo do gráfico
      let chart = am4core.create("divChartCovidRecoveredsDashboard", am4charts.PieChart);
      

      //Adiciona DataSet
      chart.data = responseApiDataSet.recovered.slice(0,this.state.covid.top);

      //Definição do Raio Interno do Gráfico
      chart.innerRadius = am4core.percent(50);
      
      //Configura Séries
      var pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "value";
      pieSeries.dataFields.category = "country";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.labels.template.maxWidth = 130;
      pieSeries.labels.template.wrap = true;
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;

      pieSeries.colors.list = [
        am4core.color("#006108"),
        am4core.color("#45E652"),
        am4core.color("#00E013")
      ];


      var rgm = new am4core.RadialGradientModifier();
      rgm.brightnesses.push(-0.8, -0.8, -0.5, 0, - 0.5);
      pieSeries.slices.template.fillModifier = rgm;
      pieSeries.slices.template.strokeModifier = rgm;
      pieSeries.slices.template.strokeOpacity = 0.4;
      pieSeries.slices.template.strokeWidth = 0;

      chart.legend = new am4charts.Legend();
      chart.legend.position = "bottom";

      this.chartCovidRecovereds = chart;
    }
  
    createMovingAverageChart(responseApiDataSet){
      
      // Create chart
      let charts = [
        am4core.create("divChartMovingAverageConfirmedDashboard", am4charts.XYChart),
        am4core.create("divChartMovingAverageDeathsDashboard", am4charts.XYChart),
        am4core.create("divChartMovingAverageActivesDashboard", am4charts.XYChart),
        am4core.create("divChartMovingAverageRecoveredsDashboard", am4charts.XYChart)
      ];
      let apiDataSet = [
        responseApiDataSet.confirmed,
        responseApiDataSet.deaths,
        responseApiDataSet.active,
        responseApiDataSet.recovered
      ];

      charts.forEach((chart, index) => {

        chart.paddingRight = 20;

        //Adiciona DataSet
        chart.data = apiDataSet[index]

        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.baseInterval = {
          "timeUnit": "minute",
          "count": 1
        };
        dateAxis.tooltipDateFormat = "HH:mm, d MMMM";

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.title.text = "Moving Average";

        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "index";
        series.dataFields.valueY = "ma";
        series.tooltipText = "Ma: [bold]{valueY}[/]";
        series.fillOpacity = 0.3;


        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineY.opacity = 0;
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);


        dateAxis.start = 0.8;
        dateAxis.keepSelection = true;
      });
      
  }
    

    componentWillUnmount() {

      if (this.chartCovidConfirmed) {
        this.chartCovidConfirmed.dispose();
      }
      if (this.chartCovidDeaths) {
        this.chartCovidDeaths.dispose();
      }
      if (this.chartCovidActives) {
        this.chartCovidActives.dispose();
      }
      if (this.chartCovidRecovereds) {
        this.chartCovidRecovereds.dispose();
      }
    }

    componentDidMount() {

      let curr = new Date();
      let start = new Date(curr.getFullYear() - 2, curr.getMonth(), curr.getDate());

      let dateStartString = start.toISOString().substr(0,10);
      let dateEndString = curr.toISOString().substr(0,10);
      let covid = this.state.covid;

      covid.start = dateStartString;
      covid.end = dateEndString;

      this.setState({covid:covid, title: "Data Visualization - Covid19 (Marcos Eduardo)", color : "white"})
      
      this.countries()

      this.asyncCovidData(); 
    }
    


    render() {

      let {title, color} = this.state;

      let countriesList = this.state.countries.map(item => {
        return (
          <option value={item}>{item}</option>
        )
      }, this);

      return (<div>


              {/*
                Header - Nome do Projeto
              */}
              <div className="header-dashboard" style={{color : color}}>{title}</div>

              {/*
                Barra de Filtragem
              */}
              <Navbar color="primary" dark expand="md">
                            <Collapse navbar>
                                <Nav navbar>
                                    
                                    <NavItem className="navitem-margin">
                                        
                                          <select 
                                              className="select-filter-country"
                                                value={this.state.covid.country} 
                                                onChange={(e) => this.updateInputValue("country", e)}
                                            >
                                              <option value="">Todos os países</option>
                                              {countriesList}
                                            </select>
                                    </NavItem>

                                    <NavItem className="navitem-margin">
                                        
                                          <select 
                                              className="select-filter-country"
                                                value={this.state.covid.top} 
                                                onChange={(e) => this.updateInputValue("top", e)}
                                            >
                                              <option value="5">Top 5</option> 
                                              <option value="10">Top 10</option>
                                              <option value="15">Top 15</option>
                                            </select>
                                    </NavItem>

                                    <NavItem className="navitem-margin">
                                            <input className="date-filter-start" 
                                                value={this.state.covid.start} 
                                                onChange={(e) => this.updateInputValue("start", e)}
                                                type="date" 
                                                placeholder="Ex.Start 01/02/1999" 
                                              ></input>

                                    </NavItem>

                                    <NavItem className="navitem-margin">
                                            <input className="date-filter-end" 
                                                value={this.state.covid.end} 
                                                onChange={(e) => this.updateInputValue("end", e)}
                                                type="date" 
                                                placeholder="Ex.End 01/02/1999" 
                                              ></input>

                                    </NavItem>

                                    <NavItem className="navitem-margin">
                                       <button className="custom-button" onClick={(e) => this.asyncCovidData()}>Analisar</button>
                                    </NavItem>
                                    
                                    {/* Input e botão para visualizar média móvel */}
                                    <NavItem className="navitem-margin">
                                    <div style={{display: this.state.displayBtnMa}} className="input-group mb-3">
                                      <input type="number" className="custom-input" 
                                          onChange={(e) => this.updateInputValue("window", e)}
                                          value = {this.state.covid.window}
                                          aria-label="Moving Average" 
                                          aria-describedby="button-ma"
                                        ></input>
                                      <button className="custom-button2" type="button" id="button-m" onClick={(e) => this.asyncMovingAverage()}>Visualizar média móvel</button>
                                    </div>
                                    </NavItem>
                                </Nav>
                            </Collapse>
              </Navbar>

              {/*
                Container onde serão agrupados os gráficos
              */}   
              <Container className="container-charts">
                <Row className="row-margin">
                  <Col>
                    <div className="title-general-covid" style={{display: this.state.displayMa === 'block' ? this.state.displayMa : this.state.displayCharts}}>Confirmados</div>
                    <div style={{display: this.state.displayLoader}} className="loader">Processando Dados...</div>
                    <div id="divChartCovidConfirmedDashboard" style={{ display: this.state.displayCharts, width: "100%", height: "500px" }}></div>
                    <div id="divChartMovingAverageConfirmedDashboard" style={{ display: this.state.displayMa, width: "100%", height: "500px" }}></div>
                  </Col>
                  <Col>
                    <div className="title-general-covid" style={{display: this.state.displayMa === 'block' ? this.state.displayMa : this.state.displayCharts}}>Mortes</div>
                    <div style={{display: this.state.displayLoader}} className="loader">Processando Dados...</div>
                    <div id="divChartCovidDeathsDashboard" style={{ display: this.state.displayCharts, width: "100%", height: "500px" }}></div>
                    <div id="divChartMovingAverageDeathsDashboard" style={{ display: this.state.displayMa, width: "100%", height: "500px" }}></div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="title-general-covid" style={{display: this.state.displayMa === 'block' ? this.state.displayMa : this.state.displayCharts}}>Ativos</div>
                    <div style={{display: this.state.displayLoader}} className="loader">Processando Dados...</div>
                    <div id="divChartCovidActivesDashboard" style={{ display: this.state.displayCharts, width: "100%", height: "500px" }}></div>
                    <div id="divChartMovingAverageActivesDashboard" style={{ display: this.state.displayMa, width: "100%", height: "500px" }}></div>
                  </Col>
                  <Col>
                    <div className="title-general-covid" style={{display: this.state.displayMa === 'block' ? this.state.displayMa : this.state.displayCharts}}>Recuperados</div>
                    <div style={{display: this.state.displayLoader}} className="loader">Processando Dados...</div>
                    <div id="divChartCovidRecoveredsDashboard" style={{ display: this.state.displayCharts, width: "100%", height: "500px" }}></div>
                    <div id="divChartMovingAverageRecoveredsDashboard" style={{ display: this.state.displayMa, width: "100%", height: "500px" }}></div>
                  </Col>
                </Row>
                
              </Container>
            </div>
          );
    }
}

export default PanelDashboard;