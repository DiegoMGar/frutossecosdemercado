import { Producto } from './Producto';
import { Pedido } from './Pedido';

export class Tienda {
  public nombre;
  public productos: Producto[];
  public pedidos: Pedido[];

  addProducto(p: Producto) {
    this.productos.push(p);
  }

  addPedido(p: Pedido) {
    this.pedidos.push(p);
  }
}
