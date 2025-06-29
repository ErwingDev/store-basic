export enum CRUDMessages {
    GetSuccess = 'Datos obtenidos correctamente.',
    GetError = 'Ocurrio un error al intentar obtener los datos.',
    GetNotfound = 'No se encontrarón registros',
    CreateSuccess = 'Registro guardado correctamente.',
    CreateError = 'Ocurrio un error al intentar guardar el registro.',
    CreateNotfound = 'Los identificadores ya fueron registrados.',
    DeleteSuccess = 'Registro eliminado correctamente.',
    DeleteError = 'Ocurrio un error al intentar eliminar el registro.',
    DeleteNotfound = 'El registro no existe.',
    UpdateSuccess = 'Registro actualizado correctamente.',
    UpdateNotfound = 'El registro no existe.',
    UpdateError = 'Ocurrio un error al intentar actualizar el registro.',
    GenericException = 'Ocurrio un error.',
}

export const CustomMessages = {
    RegisterNotFound: (field: string) => `No existe un registro relacionado con el campo ${field}`,
};

export enum AlertMessages {
    ImageNotFound = "Archivo de imagen no encontrada.",
    InvalidCredentials = "Credenciales inválidas.",
    InvalidEmail = "Email inválido.",
    LoginSuccess = "Logueado correctamente.",
}