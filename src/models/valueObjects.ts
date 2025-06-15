import { z } from "zod/v4";

// Email Value Object
export const EmailSchema = z.email();

export class Email {
	private constructor(private readonly value: string) {}

	static create(email: string): Email {
		const validatedEmail = EmailSchema.parse(email.toLowerCase().trim());
		return new Email(validatedEmail);
	}

	static fromString(email: string): Email {
		return Email.create(email);
	}

	toString(): string {
		return this.value;
	}

	getDomain(): string {
		const parts = this.value.split("@");
		return parts[1] || "";
	}

	getUsername(): string {
		const parts = this.value.split("@");
		return parts[0] || "";
	}

	equals(other: Email): boolean {
		return this.value === other.value;
	}

	toJSON(): string {
		return this.value;
	}
}

// Phone Value Object
export const PhoneSchema = z
	.string()
	.regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format");

export class Phone {
	private constructor(private readonly value: string) {}

	static create(phone: string): Phone {
		const cleanedPhone = phone.replace(/\s+/g, " ").trim();
		const validatedPhone = PhoneSchema.parse(cleanedPhone);
		return new Phone(validatedPhone);
	}

	static fromString(phone: string): Phone {
		return Phone.create(phone);
	}

	toString(): string {
		return this.value;
	}

	getDigitsOnly(): string {
		return this.value.replace(/\D/g, "");
	}

	equals(other: Phone): boolean {
		return this.getDigitsOnly() === other.getDigitsOnly();
	}

	toJSON(): string {
		return this.value;
	}
}

// URL Value Object
export const URLSchema = z.string().url();

export class URL {
	private constructor(private readonly value: string) {}

	static create(url: string): URL {
		const validatedURL = URLSchema.parse(url.trim());
		return new URL(validatedURL);
	}

	static fromString(url: string): URL {
		return URL.create(url);
	}

	toString(): string {
		return this.value;
	}

	getDomain(): string {
		try {
			return new globalThis.URL(this.value).hostname;
		} catch {
			return "";
		}
	}

	getProtocol(): string {
		try {
			return new globalThis.URL(this.value).protocol;
		} catch {
			return "";
		}
	}

	equals(other: URL): boolean {
		return this.value === other.value;
	}

	toJSON(): string {
		return this.value;
	}
}

// Salary Range Value Object
export const SalaryRangeSchema = z
	.object({
		min: z.number().positive(),
		max: z.number().positive(),
	})
	.refine((data) => data.min <= data.max, {
		message: "Minimum salary must be less than or equal to maximum salary",
	});

export type SalaryRangeData = z.infer<typeof SalaryRangeSchema>;

export class SalaryRange {
	private constructor(private readonly data: SalaryRangeData) {}

	static create(min: number, max: number): SalaryRange {
		const data = SalaryRangeSchema.parse({ min, max });
		return new SalaryRange(data);
	}

	static fromData(data: SalaryRangeData): SalaryRange {
		const validatedData = SalaryRangeSchema.parse(data);
		return new SalaryRange(validatedData);
	}

	get min(): number {
		return this.data.min;
	}

	get max(): number {
		return this.data.max;
	}

	contains(salary: number): boolean {
		return salary >= this.data.min && salary <= this.data.max;
	}

	getRange(): number {
		return this.data.max - this.data.min;
	}

	getAverage(): number {
		return (this.data.min + this.data.max) / 2;
	}

	overlaps(other: SalaryRange): boolean {
		return this.data.min <= other.data.max && this.data.max >= other.data.min;
	}

	format(currency = "USD", locale = "en-US"): string {
		const formatter = new Intl.NumberFormat(locale, {
			style: "currency",
			currency,
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		});

		return `${formatter.format(this.data.min)} - ${formatter.format(this.data.max)}`;
	}

	toString(): string {
		return this.format();
	}

	toData(): SalaryRangeData {
		return { ...this.data };
	}

	toJSON(): SalaryRangeData {
		return this.toData();
	}
}

// Location Value Object
export const LocationSchema = z.object({
	country: z.string().min(1),
	city: z.string().min(1),
	zipCode: z.string().optional(),
});

export type LocationData = z.infer<typeof LocationSchema>;

export class Location {
	private constructor(private readonly data: LocationData) {}

	static create(country: string, city: string, zipCode?: string): Location {
		const data = LocationSchema.parse({
			country: country.trim(),
			city: city.trim(),
			zipCode: zipCode?.trim(),
		});
		return new Location(data);
	}

	static fromData(data: LocationData): Location {
		const validatedData = LocationSchema.parse(data);
		return new Location(validatedData);
	}

	get country(): string {
		return this.data.country;
	}

	get city(): string {
		return this.data.city;
	}

	get zipCode(): string | undefined {
		return this.data.zipCode;
	}

	getFullAddress(): string {
		const parts = [this.data.city, this.data.country];
		if (this.data.zipCode) {
			parts.unshift(this.data.zipCode);
		}
		return parts.join(", ");
	}

	isSameCountry(other: Location): boolean {
		return this.data.country.toLowerCase() === other.data.country.toLowerCase();
	}

	isSameCity(other: Location): boolean {
		return (
			this.isSameCountry(other) &&
			this.data.city.toLowerCase() === other.data.city.toLowerCase()
		);
	}

	equals(other: Location): boolean {
		return this.isSameCity(other) && this.data.zipCode === other.data.zipCode;
	}

	toString(): string {
		return this.getFullAddress();
	}

	toData(): LocationData {
		return { ...this.data };
	}

	toJSON(): LocationData {
		return this.toData();
	}
}
