export const OS = {
  RedHat: 'RedHat',
  CentOS: 'CentOS',
  SUSE: 'SUSE',
  Ubuntu: 'Ubuntu',
  'Windows Server': 'Windows Server'
};

export const ARCH = {
  x86_64: 'x86_64',
  aarch64: 'aarch64',
  ppc64: 'ppc64'
};

export const FS_TYPE = {
  ext3: 'ext3',
  ext4: 'ext4',
  xfs: 'xfs',
  swap: 'swap',
  ntfs: 'ntfs',
  vfat: 'vfat'
};

// 磁盘分区
export const DISKS_MAP = {
  header: {
    label: '磁盘名称',
    value: 'disk',
    type: 'select',
    options: [],
    defaultValue: '',
    help: '第一个分区默认为系统盘分区'
  },
  list: {
    value: 'partitions',
    children: [
      // {
      //   label: '名称',
      //   value: 'name',
      //   defaultValue: '',
      //   type: 'input'
      // },
      {
        label: '分区名称',
        value: 'mountpoint',
        defaultValue: '',
        type: 'input'
      },
      {
        label: '分区大小(GB)',
        value: 'size',
        defaultValue: '',
        type: 'input',
        placeholder: '支持数字、free输入'
      },
      {
        label: '文件系统类型',
        value: 'fstype',
        defaultValue: '',
        type: 'select',
        options: FS_TYPE
      }
    ]
  },
  initialValue: [
    {
      disk: '',
      partitions: [{ size: '', fstype: '', mountpoint: '' }]
    }
  ]
};
