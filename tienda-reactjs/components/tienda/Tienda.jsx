import React from 'react';
import { Redirect } from 'react-router-dom';
import * as firebase from 'firebase';
//=========Importar Componentes=========================
import BarraNavegacion from './BarraNavegacion.jsx';
import Catalogo from './Catalogo.jsx';
//======================================================
class Tienda extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      catalogo: [],
      productos: [],
      listaCarrito : [],
      filtrados: [],
      resultado: [],
      productoCarrito: {
        id: '',
        descripcion: '',
        imagen: '',
        cantidad: '',
      },
      filtro: false,
      loader: true
    };
    this.actualizarDisponible = this.actualizarDisponible.bind(this);
    this.mostrarProductos = this.mostrarProductos.bind(this);
    this.filtrarCatalogo = this.filtrarCatalogo.bind(this);
  }
  //-------------------------------------------------------------------------------
  componentWillMount(){
      const listaProductos = []
      firebase.database().ref("productos").once("value").then((snapshot) => {
        snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key;
          var childData = childSnapshot.val();
          listaProductos.push(childData);
        });
        this.setState({catalogo : listaProductos });
        this.setState({productos : this.state.catalogo});
      })
  }

  //------------------------------------------------------------------------------
  render(){
  if(!sessionStorage.getItem('Session')){
    return <Redirect to="/" />
  }

    return(
    <div className="tienda row">
      <div className="container">
        <BarraNavegacion contador={this.contadorCarrito()}/>
        <div className="left lista-productos box">
          <div className="col s12 white animated fadeInDown fast">
            <h4 className="col m6 s12 black-text left ">Cátalogo de productos</h4>
            <h4 className="right col m6 s12 input-field">
            <i className="material-icons prefix black-text">search</i>
            <input onChange={this.filtrarCatalogo} value={this.state.value} type="text" id="descripcion" className="black-text no-margin-bottom"/>
            <label htmlFor="descripcion" className="black-text">¿Qué estás buscando?</label>
            </h4>
          </div>
        {
          this.mostrarProductos()
        }
        </div>
      </div>
      </div>
    )
  }
  //------------------------------------------------------------------------------
  mostrarProductos(){
    return this.state.productos.map(
      (producto) => { return <Catalogo actualizarDisponible={this.actualizarDisponible} productos={this.state.productos} id={producto.id}  nombre={ producto.nombre } imagen={ producto.imagen } descripcion={ producto.descripcion } disponible={ producto.disponible } precio ={producto.precio} /> }
    )
  }
  //----------------------------------------------------------------------------
  filtrarCatalogo(event){
    this.state.productos = this.state.catalogo;
    let palabraFiltro = this.state.productos;
    let item = this.state.productos;
    let itemMatch = [];

    palabraFiltro = palabraFiltro.filter(function(item){
      return item.descripcion.toLowerCase().search(event.target.value.toLowerCase()) != -1;
    });

    this.setState({productos : palabraFiltro});
    if(palabraFiltro.length == 0){
      this.state.productos = []
    }


    console.log(palabraFiltro);

    }
    //--------------------------------------------------------
    actualizarDisponible(item, cantidad){
      for (let productoLista of this.state.productos){
        if (productoLista.id == item.id){
          this.verificarCarrito(item, cantidad)
          productoLista.disponible = (Number(productoLista.disponible) - Number(cantidad))
          this.setState({productos : this.state.productos})
          this.setState({listaCarrito : this.state.listaCarrito})
        }
      }
    }
    //-------------------------------------------------------------
    verificarCarrito(item, cantidad){
      if(this.guardarCarrito(item, cantidad) == false){
        this.state.listaCarrito.push(item)
      }
      this.setState({listaCarrito : this.state.listaCarrito})
      sessionStorage.setItem("Carrito", JSON.stringify(this.state.listaCarrito));
    }
    //-------------------------------------------------------------
    guardarCarrito(item, cantidad){
      if(this.state.listaCarrito.length > 0){
        for(let itemGuardado of this.state.listaCarrito){
          if(itemGuardado.id == item.id){
            itemGuardado.cantidad = (Number(itemGuardado.cantidad) + Number(cantidad))
            return true //Devolver verdadero si el producto existia en el carrito
          }
        }
        return false;
      }
      return false;
    }
    //-------------------------------------------------------------

    itemsCarrito(){
      if(sessionStorage.getItem("Carrito")){
        this.state.listaCarrito = JSON.parse(sessionStorage.getItem("Carrito"));
        return JSON.parse(sessionStorage.getItem("Carrito"));
      }
      return 0;
    }
    //--------------------Contador de items en menu---------------------------------
    contadorCarrito(){
      return this.itemsCarrito().length
    }
  }
  export default Tienda;
