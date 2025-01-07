import { useClipboard } from 'use-clipboard-copy'

export const Tips = ({ mpname }: { mpname: string }) => {
  const clipboard = useClipboard()
  return (
    <div>
      关注{' '}
      <span className={'text-red-600'} onClick={() => clipboard.copy(mpname)}>
        {mpname}
      </span>{' '}
      获取下载密码
    </div>
  )
}
