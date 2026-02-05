export class CreateBookingCommand {
    constructor(
        public readonly userId: string,
        public readonly eventId: string,
        public readonly quantity: number,
    ) { }
}
