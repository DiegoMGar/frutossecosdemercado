export default abstract class GeneralException extends Error {
  protected constructor(public message: string, public name: string) {
    super(message);
    console.log(message);
  }
}
