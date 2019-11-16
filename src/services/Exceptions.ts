export class NotFoundException extends Error {
    static NAME = "NotFoundException";
    name = NotFoundException.NAME;

    constructor(message: string) {
        super(message)
    }
}

export class BadRequestException extends Error {
    static NAME = "BadRequestException";
    name = BadRequestException.NAME;

    constructor(message: string) {
        super(message)
    }
}
