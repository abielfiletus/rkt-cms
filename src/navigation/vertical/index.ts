// ** Icon imports
import ChartPie from 'mdi-material-ui/ChartPie'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import { VerticalNavItemsType } from '../../@core/layouts/types'
import Account from 'mdi-material-ui/Account'
import TextBoxSearchOutline from 'mdi-material-ui/TextBoxSearchOutline'
import TextBoxPlusOutline from 'mdi-material-ui/TextBoxPlusOutline'
import TextBoxCheckOutline from 'mdi-material-ui/TextBoxCheckOutline'
import FileArrowUpDownOutline from 'mdi-material-ui/FileArrowUpDownOutline'
import { Cogs, TextBoxMultipleOutline } from 'mdi-material-ui'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: 'Laporan',
      subject: 'dashboard',
      action: ['read']
    },
    {
      title: 'Dashboard',
      icon: ChartPie,
      path: '/dashboard',
      subject: 'dashboard',
      action: 'read'
    },
    {
      sectionTitle: 'Verifikasi',
      subject: 'penyusunan-rkt',
      action: 'approve'
    },
    {
      title: 'Verifikasi RKT',
      icon: TextBoxSearchOutline,
      path: '/verifikasi-rkt',
      subject: 'penyusunan-rkt',
      action: 'approve'
    },
    {
      sectionTitle: 'Master Data',
      subject: ['indikator-kinerja-utama', 'penyusunan-rkt', 'capaian', 'perjanjian-kerja'],
      action: ['create', 'read', 'update', 'delete']
    },
    // {
    //   title: 'Rancangan Strategis',
    //   icon: TextBoxSearchOutline,
    //   path: '/rencana-strategis'
    // },
    {
      title: 'Indikator Kinerja Utama',
      icon: FileArrowUpDownOutline,
      path: '/indikator-kinerja-utama',
      subject: 'indikator-kinerja-utama',
      action: ['create', 'read', 'update', 'delete']
    },
    {
      title: 'Penyusunan RKT',
      icon: TextBoxPlusOutline,
      path: '/penyusunan-rkt',
      subject: 'penyusunan-rkt',
      action: ['create', 'read', 'update', 'delete']
    },
    {
      title: 'Capaian',
      icon: TextBoxCheckOutline,
      path: '/capaian',
      subject: 'capaian',
      action: ['create', 'read', 'update', 'delete']
    },
    {
      title: 'Perjanjian Kerja',
      path: '/perjanjian-kerja',
      icon: GoogleCirclesExtended,
      subject: 'perjanjian-kerja',
      action: ['create', 'read', 'update', 'delete']
    },
    {
      sectionTitle: 'Bantuan',
      subject: ['user', 'dokumen', 'pengaturan'],
      action: ['create', 'read', 'update', 'delete']
    },
    {
      title: 'User',
      icon: Account,
      path: '/user',
      subject: 'user',
      action: ['create', 'read', 'update', 'delete']
    },
    {
      icon: TextBoxMultipleOutline,
      title: 'Dokumen',
      path: '/dokumen',
      subject: 'dokumen',
      action: ['create', 'read', 'update', 'delete']
    },
    {
      icon: Cogs,
      title: 'Pengaturan',
      path: '/pengaturan',
      subject: 'pengaturan',
      action: ['create', 'read', 'update', 'delete']
    }
  ]
}

export default navigation
