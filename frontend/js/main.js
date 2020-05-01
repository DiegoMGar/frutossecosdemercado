document.getElementById('newProductForm').onsubmit = ev => {
  ev.preventDefault();
};
document.getElementById('newRequestForm').onsubmit = ev => {
  ev.preventDefault();
};

class Cliente {
  constructor(nombre = null, telefono = null, direccion = null, id) {
    this.nombre = nombre;
    this.telefono = telefono;
    this.direccion = direccion;
    this.id = id || 0;
  }

  posIdInPlain() {
    return this.plain().length - 1;
  }

  plain() {
    return [
      this.nombre,
      this.telefono,
      this.direccion,
      this.id,
    ];
  }
}

class Producto {
  constructor(nombre, medida, id) {
    this.nombre = nombre || null;
    this.medida = medida || 'kg';
    this.id = id || 0;
  }

  posIdInPlain() {
    return this.plain().length - 1;
  }

  plain() {
    return [
      this.nombre,
      this.medida,
      this.id,
    ];
  }
}

class Pedido {
  constructor(producto, cantidad, cliente, id) {
    this.producto = producto || new Producto();
    this.cantidad = cantidad || null;
    this.cliente = cliente || new Cliente();
    this.id = id || 0;
  }

  posIdInPlain() {
    return this.plain().length - 1;
  }

  plain() {
    return [
      this.producto.nombre,
      this.cantidad + ' ' + this.producto.medida,
      ...this.cliente.plain(),
      this.id,
    ];
  }
}

class Tienda {
  constructor() {
    this.tablaPedidos = '#tablaPedidos';
    this.tablaClientes = '#tablaClientes';
    this.tablaProductos = '#tablaProductos';
    this.productos = [];
    this.clientes = [];
    this.pedidos = [];
    this.resumido = false;
    this.loading = true;
  }

  addPedido(p) {
    p.id = this.pedidos.length;
    this.pedidos.push(p);
    this.save();
  }

  removePedido(row) {
    console.log('Borrando: ', row);
    this.pedidos.splice(row, 1);
    this.pedidos.forEach((pedido, i) => {
      pedido.id = i;
    });
    this.save();
  }

  addCliente(c) {
    c.id = this.clientes.length;
    this.clientes.push(c);
    this.save();
  }

  removeCliente(row) {
    console.log('Borrando: ', row);
    this.clientes.splice(row, 1);
    this.clientes.forEach((cliente, i) => {
      cliente.id = i;
    });
    this.save();
  }

  addProducto(p) {
    p.id = this.productos.length;
    this.productos.push(p);
    this.save();
  }

  removeProducto(row) {
    console.log('Borrando: ', row);
    this.productos.splice(row, 1);
    this.productos.forEach((producto, i) => {
      producto.id = i;
    });
    this.save();
  }

  pedidosDataset() {
    return this.pedidos.map(pedido => pedido.plain());
  }

  clientesDataSet() {
    return this.clientes.map(c => c.plain());
  }

  productosDataSet() {
    return this.productos.map(p => p.plain());
  }

  printPedidos() {
    const table = $(this.tablaPedidos).DataTable({
      paging: false,
      language: {
        url: 'language/datatable.json',
      },
      data: this.pedidosDataset(),
      columns: [
        {title: 'Producto'},
        {title: 'Cantidad'},
        {title: 'Cliente'},
        {title: 'Tlf.'},
        {title: 'Direccion'},
        {
          title: 'Accion',
          data: null,
          defaultContent:
            '<button class="btn btn-sm btn-default">Ocultar</button>',
        },
      ],
    });
    const self = this;
    $(this.tablaPedidos + ' tbody').on('click', 'button', function () {
      const data = table.row($(this).parents('tr')).data();
      self.removePedido(data[new Pedido().posIdInPlain()]);
      self.rePrintPedidos();
    });
  }

  rePrintPedidos() {
    $(this.tablaPedidos).DataTable().clear().destroy();
    $(this.tablaPedidos + ' tbody').off('click', 'button');
    this.printPedidos();
  }

  printClientes() {
    const table = $(this.tablaClientes).DataTable({
      paging: false,
      language: {
        url: 'language/datatable.json',
      },
      data: this.clientesDataSet(),
      columns: [
        {title: 'Nombre'},
        {title: 'Teléfono'},
        {title: 'Dirección'},
        {
          title: 'Accion',
          data: null,
          defaultContent:
            '<button class="btn btn-sm btn-danger">Borrar</button>',
        },
      ],
    });
    const self = this;
    $(this.tablaClientes + ' tbody').on('click', 'button', function () {
      const data = table.row($(this).parents('tr')).data();
      self.removeCliente(data[new Cliente().posIdInPlain()]);
      self.rePrintClientes();
      select2ClienteNewPedido(self, true);
    });
  }

  rePrintClientes() {
    $(this.tablaClientes).DataTable().clear().destroy();
    $(this.tablaClientes + ' tbody').off('click', 'button');
    this.printClientes();
  }

  printProductos() {
    var table = $(this.tablaProductos).DataTable({
      paging: false,
      language: {
        url: 'language/datatable.json',
      },
      data: this.productosDataSet(),
      columns: [
        {title: 'Nombre'},
        {title: 'Medida'},
        {
          title: 'Accion',
          data: null,
          defaultContent:
            '<button class="btn btn-sm btn-danger">Borrar</button>',
        },
      ],
    });
    const self = this;
    $(this.tablaProductos + ' tbody').on('click', 'button', function () {
      const data = table.row($(this).parents('tr')).data();
      self.removeProducto(data[new Producto().posIdInPlain()]);
      self.rePrintProductos();
      select2ProductoNewPedido(self, true);
    });
  }

  rePrintProductos() {
    $(this.tablaProductos).DataTable().clear().destroy();
    $(this.tablaProductos + ' tbody').off('click', 'button');
    this.printProductos();
  }

  save() {
    localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
    localStorage.setItem('productos', JSON.stringify(this.productos));
    localStorage.setItem('clientes', JSON.stringify(this.clientes));
  }

  load() {
    this.loadProductos();
    this.loadClientes();
    this.loadPedidos();
  }

  loadPedidos() {
    let pedidos = localStorage.getItem('pedidos');
    if (pedidos) {
      pedidos = JSON.parse(pedidos);
      this.pedidos = pedidos.map((pedido, i) => {
        return new Pedido(
          new Producto(...Object.values(pedido.producto)),
          pedido.cantidad,
          new Cliente(...Object.values(pedido.cliente)),
          i,
        );
      });
    }
  }

  loadClientes() {
    let clientes = localStorage.getItem('clientes');
    if (clientes) {
      clientes = JSON.parse(clientes);
      this.clientes = clientes.map((cliente, i) => new Cliente(...Object.values(cliente), i));
    }
  }

  loadProductos() {
    let productos = localStorage.getItem('productos');
    if (productos) {
      productos = JSON.parse(productos);
      this.productos = productos.map((producto, i) => new Producto(...Object.values(producto), i));
    }
  }
}

$(document).ready(function () {
  main();
});

function main() {
  const tienda = new Tienda();
  tienda.load();
  tienda.printPedidos();
  tienda.printClientes();
  tienda.printProductos();
  select2ProductoNewPedido(tienda);
  select2ClienteNewPedido(tienda);
  const medidaSelect = select2NewProductMedida();
  newProductAddClick(medidaSelect, tienda);
  newClienteAddClick(tienda);
  newRequestAddClick(tienda);
  resumenClick(tienda);
  tienda.loading = false;
}

function select2ProductoNewPedido(tienda, forceClean = false) {
  const select = $('#newRequestProductSelect');
  if (forceClean) {
    select.children().detach();
  }
  select.select2({width: '100%'});
  tienda.productos.forEach((producto) => {
    appendSelect2('#newRequestProductSelect', producto.nombre, `${producto.nombre} (${producto.medida})`);
  });
}

function select2ClienteNewPedido(tienda, forceClean = false) {
  const select = $('#newRequestClientSelect');
  if (forceClean) {
    select.children().detach();
  }
  select.select2({width: '100%'});
  tienda.clientes.forEach((cliente) => {
    appendSelect2('#newRequestClientSelect', cliente.nombre, cliente.nombre);
  });
}

function select2NewProductMedida() {
  const medidaSelect = $('#newProductMedidaSelect');
  medidaSelect.select2({width: '100%'});
  return medidaSelect;
}

function newProductAddClick(medidaSelect, tienda) {
  const newProducto = $('#newProduct');
  $('#newProductAddButton').on('click', () => {
    if (!newProducto.val() || !medidaSelect.val()) {
      Swal.fire('Error', 'Debes poner nombre y elegir la medida.', 'error');
      return;
    }
    const producto = new Producto(newProducto.val(), medidaSelect.val());
    tienda.addProducto(producto);
    tienda.rePrintProductos();
    newProducto.val(null);
    changeSelect2(medidaSelect, 0);
    appendSelect2('#newRequestProductSelect', producto.nombre, `${producto.nombre} (${producto.medida})`);
  });
}

function newClienteAddClick(tienda) {
  $('#newClienteAddButton').on('click', () => {
    const nombreInput = $('#newClienteName');
    const tlfInput = $('#newClienteTlf');
    const direccionInput = $('#newClienteDireccion');
    if (!nombreInput.val()) {
      Swal.fire('Error', 'El cliente tiene que tener, como mínimo, nombre.', 'error');
      return;
    }
    const cliente = new Cliente(nombreInput.val(), tlfInput.val(), direccionInput.val());
    tienda.addCliente(cliente);
    tienda.rePrintClientes();
    appendSelect2('#newRequestClientSelect', cliente.nombre, cliente.nombre);
    nombreInput.val(null);
    tlfInput.val(null);
    direccionInput.val(null);
  });
}

function appendSelect2(selector, id, text) {
  const data = {
    id,
    text,
  };
  const newOption = new Option(data.text, data.id, false, false);
  $(selector).append(newOption);
}

function changeSelect2(selector, id) {
  const jQselector = (typeof selector === 'string') ? $(selector) : selector;
  jQselector.val(id);
  jQselector.trigger('change');
}

function newRequestAddClick(tienda) {
  $('#newRequestAddButton').on('click', () => {
    const clienteInput = $('#newRequestClientSelect');
    const productoInput = $('#newRequestProductSelect');
    const cantidadInput = $('#newRequestQuantity');
    if (!productoInput.val() || !cantidadInput.val()) {
      Swal.fire('Error', 'Debes seleccionar el producto y la cantidad.', 'error');
      return;
    }
    if (!/^[\d.,]+$/.test(cantidadInput.val())) {
      Swal.fire('Error', 'La cantidad debe ser un número.', 'error');
      return;
    }
    const cantidad = cantidadInput.val().replace(',', '.');
    let foundCliente = tienda.clientes.find(c => c.nombre === clienteInput.val());
    let foundProducto = tienda.productos.find(p => p.nombre === productoInput.val());
    const pedido = new Pedido(foundProducto, cantidad, foundCliente);
    tienda.addPedido(pedido);
    tienda.rePrintPedidos();
    changeSelect2(clienteInput, 0);
    changeSelect2(productoInput, 0);
    cantidadInput.val(null);
  });
}

function resumenClick(tienda) {
  $('#resumenButton').on('click', () => {
    resumenPedidos(tienda);
  });
}

function resumenPedidos(tienda) {
  const resumen = $('#tablaResumen');
  if (tienda.resumido) {
    resumen.DataTable().clear().destroy();
  }
  tienda.resumido = true;
  const resumenData = {};
  tienda.pedidos.forEach(pedido => {
    if (!resumenData[pedido.producto.nombre]) {
      // SI NO EXISTE LA CLAVE LE DOY VALOR PARA EMPEZAR A SUMAR
      resumenData[pedido.producto.nombre] = {cantidad: 0, medida: pedido.producto.medida};
    }
    resumenData[pedido.producto.nombre].cantidad += +pedido.cantidad;
  });
  const resumenDataSet = [];
  Object.keys(resumenData).forEach(k => {
    resumenDataSet.push([k, resumenData[k].cantidad + ' ' + resumenData[k].medida]);
  });
  resumen.DataTable({
    paging: false,
    language: {
      url: 'language/datatable.json',
    },
    data: resumenDataSet,
    columns: [
      {title: 'Producto'},
      {title: 'Cantidad'},
    ],
  });
}