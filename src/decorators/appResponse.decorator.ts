import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class AppResponseDto<T> {
  @ApiProperty()
  message: string;

  @ApiProperty()
  code: number;

  data?: T;
}

const getArraySchema = <TModel extends Type<any>>(
  model: TModel,
): Record<string, any> => ({
  type: 'array',
  items: { $ref: getSchemaPath(model) },
});

const getObjectSchema = <TModel extends Type<any>>(
  model: TModel,
): Record<string, any> => ({
  $ref: getSchemaPath(model),
});

/**
 * @param params data of api response or null
 * e.g.
 *  `AppResponse({model: classDto})`
 *  `AppResponse({isNull: true})`
 *  `AppResponse({model: classDto, isArrat: true})`)
 * @returns
 */
export const AppResponse = <TModel extends Type<any>>(params: {
  model?: TModel;
  isNull?: boolean;
  isArray?: boolean;
}) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(AppResponseDto) },
          !params.isNull
            ? {
                properties: {
                  data: {
                    ...(params.isArray
                      ? getArraySchema(params.model)
                      : getObjectSchema(params.model)),
                  },
                },
              }
            : {},
        ],
      },
    }),
  );
};
