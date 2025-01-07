import { useClipboard } from 'use-clipboard-copy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const Tips = ({ mpname }: { mpname: string }) => {
  const clipboard = useClipboard({ copiedTimeout: 1000 })
  return (
    <div onClick={() => clipboard.copy(mpname)}>
      关注{' '}
      <span className={'flex-row space-x-1'}>
        <span className={'text-red-600'}>{mpname}</span>
        {clipboard.copied ? <FontAwesomeIcon icon="check" /> : <FontAwesomeIcon icon="copy" />}
      </span>{' '}
      获取下载密码
    </div>
  )
}
