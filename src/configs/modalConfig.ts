export interface IModalProp {
  data?: Record<string, any>
  id?: number
  type: 'detail' | 'tambah' | 'ubah'
  handleClose: (hasData: boolean) => void
}
