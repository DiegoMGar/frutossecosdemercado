export class Producto {
  public uuid: string;
  public nombre: string;
  public stock: number;
  public precio: number;

  constructor(input: any) {
    this.nombre = input.nombre;
    this.stock = input.stock;
    this.precio = input.precio;
  }
}
