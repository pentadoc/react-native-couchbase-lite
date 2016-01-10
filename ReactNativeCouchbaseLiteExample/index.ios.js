/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  Navigator,
  } = React;
//var {Router, Route, Schema, Animations, TabBar} = require('react-native-router-flux');

var ReactCBLite = require('react-native').NativeModules.ReactCBLite;
ReactCBLite.init(5984, 'admin', 'password');


var lastChange = {};
var manager = require('./common/dbManager');
var ReactNativeCouchbaseLiteExample = React.createClass({
  render: function () {
    return (
      <Home></Home>
    );
  }
});

var Home = React.createClass({
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
  },

  componentDidMount() { 
  
    var self = this;
    var database = new manager();
    database.createLocalDatabase()
    .then((res)=>{
       database.getAllDocuments()
          .then((res) => {
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(res.rows)
            });
        });

      //database.replicate('http://dbreader:password@couchtest.coveycs.com:5984/', 'testdb', true)
      database.bidirectionalReplicate(true)
        .then((res) => {
          console.log(res);
      });
/*
      database.replicate(config.db.localUrl, config.db.remoteName, true)
        .then((res) => {
          console.log(res);
      });*/


      database.getChanges(true)
          .then((res)=>{
          if(false){
            lastChange = res;
             database.getAllDocuments()
              .then((res) => {
                this.setState({
                  dataSource: this.state.dataSource.cloneWithRows(res.rows)
                });
            });
          }
        });
            
    })
  },



  render() {
    return (

      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderMovie}
          style={styles.listView}/>
      </View>
    )
  },
  renderMovie(movie) {
    var movie = movie.doc;
    return (
      <View style={styles.container}>
        <Image
          source={{uri: movie.image}}
          style={styles.thumbnail}/>
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{movie.name}</Text>
          <Text style={styles.year}>{movie.year}</Text>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 81,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('ReactNativeCouchbaseLiteExample', () => ReactNativeCouchbaseLiteExample);
