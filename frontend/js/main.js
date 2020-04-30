document.getElementById('newProductForm').onsubmit = ev => {
  ev.preventDefault();
};
document.getElementById('newRequestForm').onsubmit = ev => {
  ev.preventDefault();
};

class Cliente {
  constructor(nombre = null, telefono = null, direccion = null) {
    this.nombre = nombre;
    this.telefono = telefono;
    this.direccion = direccion;
  }

  plain() {
    return [
      this.nombre,
      this.telefono,
      this.direccion,
    ];
  }
}

class Pedido {
  constructor(producto, cantidad, cliente) {
    this.producto = producto || null;
    this.cantidad = cantidad || null;
    this.cliente = cliente || new Cliente();
    this.id = null;
  }

  plain() {
    return [
      this.producto,
      this.cantidad,
      ...this.cliente.plain(),
    ];
  }
}

class Tienda {
  constructor() {
    this.datatableId = '#tablaPedidos';
    this.productos = [];
    this.pedidos = [];
    this.clientes = [];
  }

  addPedido(p) {
    p.id = this.pedidos.length;
    this.pedidos.push(p);
  }

  addCliente(p) {
    this.clientes.push(p);
  }

  dataSet() {
    return this.pedidos.map(pedido => pedido.plain());
  }

  clientesDataSet() {
    return this.clientes.map(c => c.plain());
  }

  printDatatable() {
    const table = $(this.datatableId).DataTable({
      language: {
        url: 'language/datatable.json',
      },
      data: this.dataSet(),
      columns: [
        { title: 'Producto' },
        { title: 'Cantidad' },
        { title: 'Cliente' },
        { title: 'Tlf.' },
        { title: 'Direccion' },
        {
          title: 'Accion',
          data: null,
          defaultContent:
            '<button class="btn btn-default">Comprado</button>',
        },
      ],
    });
    const self = this;
    $(this.datatableId + ' tbody').on('click', 'button', function() {
      const row = $(this).parents('tr')[0].rowIndex;
      self.remove(row - 1);
    });
  }

  remove(row) {
    console.log('Borrando: ', row);
    this.pedidos.splice(row, 1);
    this.reprintDatatable();
  }

  reprintDatatable() {
    $(this.datatableId).DataTable().clear().destroy();
    $(this.datatableId + ' tbody').off('click', 'button');
    this.printDatatable();
  }
}

const tienda = new Tienda();
const maricarmen = new Cliente('Maricarmen', '663232323', 'lorem ipsum');
tienda.addCliente(maricarmen);
const pedido = new Pedido('Manzana', '1.5 kg', maricarmen);
tienda.addPedido(pedido);
tienda.printDatatable();


setTimeout(() => {
  const maricarmen = new Cliente('Maricarmen', '663232323', 'lorem ipsum');
  tienda.addCliente(maricarmen);
  const pedido = new Pedido('Manzana', '1.5 kg', maricarmen);
  tienda.addPedido(pedido);
  tienda.reprintDatatable();
}, 3000);

$(document).ready(function() {

  $('#tablaClientes').DataTable({
    language: {
      url: 'language/datatable.json',
    },
    data: tienda.clientesDataSet(),
    columns: [
      { title: 'Nombre' },
      { title: 'Teléfono' },
      { title: 'Direccion' },
      {
        title: 'Accion',
        defaultContent:
          '<button class="btn btn-sm btn-danger">Borrar</button>',
      },
    ],
  });
});