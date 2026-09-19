import type { Query } from "mongoose";

/**
 * Ported from utils/apifeatures.js. Same behaviour: keyword regex on name,
 * gt/gte/lt/lte range filters, and skip/limit pagination — now generic over the
 * document type so the returned query stays typed.
 */
export class ApiFeatures<T> {
  constructor(
    public query: Query<T[], T>,
    private readonly queryStr: Record<string, string | undefined>,
  ) {}

  search(): this {
    const keyword = this.queryStr.keyword
      ? { name: { $regex: this.queryStr.keyword, $options: "i" } }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter(): this {
    const copy: Record<string, unknown> = { ...this.queryStr };
    for (const key of ["keyword", "page", "limit"]) delete copy[key];
    const parsed = JSON.parse(
      JSON.stringify(copy).replace(/\b(gt|gte|lt|lte)\b/g, (k) => `$${k}`),
    );
    this.query = this.query.find(parsed);
    return this;
  }

  pagination(resultPerPage: number): this {
    const currentPage = Number(this.queryStr.page) || 1;
    this.query = this.query.limit(resultPerPage).skip(resultPerPage * (currentPage - 1));
    return this;
  }
}
