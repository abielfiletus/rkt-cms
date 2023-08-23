export const VerificationStatus: Record<string, any> = {
  'Butuh Persetujuan': '0',
  Ditolak: '1',
  Revisi: '2',
  Selesai: '3',
  Disetujui: '4',
  'Belum ada aksi': '5',
  Pending: '6'
}

export const ReverseVerificationStatus: Record<string, any> = {
  '0': 'Verifikasi',
  '1': 'Ditolak',
  '2': 'Revisi',
  '3': 'Selesai',
  '4': 'Disetujui',
  '5': 'Belum Diajukan',
  '6': 'Pending'
}

export const VerificationStatusColor: Record<string, any> = {
  0: 'secondary',
  1: 'error',
  2: 'warning',
  3: 'info',
  4: 'success',
  5: 'secondary',
  6: 'secondary'
}

export const CapaianStatus: Record<string, any> = {
  '0': 'Belum Proses',
  '1': 'Dalam Proses',
  '2': 'Selesai'
}

export const ReverseCapaianStatus: Record<string, any> = {
  'Belum Proses': '0',
  'Dalam Proses': '1',
  Selesai: '2'
}

export const CapaianStatusColor: Record<string, any> = {
  '0': 'error',
  '1': 'info',
  '2': 'rgb(22, 193, 80)'
}

export enum ConfigKey {
  RKT = 'pengajuan-rkt',
  TW1 = 'capaian-tw1',
  TW2 = 'capaian-tw2',
  TW3 = 'capaian-tw3',
  TW4 = 'capaian-tw4'
}
