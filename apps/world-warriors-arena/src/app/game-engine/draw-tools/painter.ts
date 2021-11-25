import { Subscription } from "rxjs";
import { Engine } from "../engine";

export abstract class Painter {
  private engineSubscription: Subscription

  public abstract paint(): void

  public start(): void {
    this.engineSubscription = Engine.onFire.subscribe(() => {
      this.paint()
    })
  }

  public stop(): void {
    this.engineSubscription.unsubscribe()
  }
}
