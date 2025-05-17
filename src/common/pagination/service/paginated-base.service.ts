import { Injectable } from '@nestjs/common';
import { Repository, FindManyOptions, Like, ObjectLiteral, FindOptionsOrder, ILike } from 'typeorm';
import { PaginateQueryDto } from '../dto/pagination.dto';

@Injectable()
export abstract class PaginateService<T extends ObjectLiteral> {
    
    constructor(protected readonly repository: Repository<T>) {}

    async paginate(
        PaginateQueryDto: PaginateQueryDto,
        options: {
            searchableColumns?: string[];
            defaultSort?: FindOptionsOrder<T>;
            relations?: string[];
            where?: any;
        } = {},
    ) {
        const { page = 1, limit = 10, search, sortBy } = PaginateQueryDto;
        const { 
            searchableColumns = [], 
            defaultSort = {} as FindOptionsOrder<T>, 
            relations = [], 
            where: additionalWhere = {} 
        } = options;
        const queryBuilder = this.repository.createQueryBuilder('mainEntity');

        // Configuración Where
        const where: any[] = [additionalWhere];
        if (search && searchableColumns.length > 0) {
            const textColumns = searchableColumns.filter(column => {
                const metadata = this.repository.metadata.findColumnWithPropertyName(column);
                return metadata?.type === 'varchar' || metadata?.type === 'text' || metadata?.type === 'character varying';
            });
            where.push(
                ...textColumns.map((column) => ({
                    // [column]: Like(`%${search}%`),   // respeta el texto
                    [column]: ILike(`%${search}%`),     // no distingue mayusculas y minusculas 
                }))
            );
        }

        // Configuración ORDER
        let order: FindOptionsOrder<T> = defaultSort;
        if (sortBy) {
            const [column, direction] = sortBy.split(':');
            order = { [column]: direction.toUpperCase() } as FindOptionsOrder<T>;
        }
        // Consulta
        const findOptions: FindManyOptions<T> = {
            where: where.length > 1 ? where : where[0],
            order,
            take: limit,
            skip: (page - 1) * limit,
            relations,
        };

        const [data, total] = await this.repository.findAndCount(findOptions);

        return {
            data,
            meta: {
                totalItems: total,
                itemsPerPage: limit,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            },
            links: this.generateLinks(page, limit, total),
        };
    }

    private generateLinks(
        currentPage: number,
        limit: number,
        total: number,
    ) {
        const totalPages = Math.ceil(total / limit);
        return {
            first: `?page=1&limit=${limit}`,
            previous: currentPage > 1 ? `?page=${currentPage - 1}&limit=${limit}` : null,
            next: currentPage < totalPages ? `?page=${currentPage + 1}&limit=${limit}` : null,
            last: `?page=${totalPages}&limit=${limit}`,
        };
    }

}