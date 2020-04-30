import { Producto } from './Producto';

export class Pedido {
  public uuid: string;
  public producto: Producto;
  public cantidad: number;
  public comprado: boolean;
  public entregado: boolean;

  propType(key: string) {
    switch (key) {
      case 'comprado':
      case 'entregado':
        return 'BOOL';
    }
  }
}
