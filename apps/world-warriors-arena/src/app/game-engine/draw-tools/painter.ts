import { Subscription } from "rxjs";
import { Engine } from "../engine";

export abstract class Painter {
  private engineSubscription: Subscription

  constructor(public engine: Engine) { }

  public abstract paint(): void

  public start(): void {
    this.engineSubscription = this.engine.onFire.subscribe(() => {
      this.paint()
    })
  }

  public stop(): void {
    this.engineSubscription.unsubscribe()
  }
}


// A Javascript program to check if a given point
// lies inside a given polygon
// Refer https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
// for explanation of functions onSegment(),
// orientation() and doIntersect()
// Define Infinite (Using INT_MAX
// caused overflow problems)
