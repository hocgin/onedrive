import React, { MouseEventHandler, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import toast from 'react-hot-toast'
import { useClipboard } from 'use-clipboard-copy'

import Image from 'next/image'
import { useRouter } from 'next/router'

import { getBaseUrl } from '../utils/getBaseUrl'
import { getStoredToken } from '../utils/protectedRouteHandler'
import CustomEmbedLinkMenu from './CustomEmbedLinkMenu'
import siteConfig from '../../config/site.config'
import { extractAuthCodeFromRedirected } from '../utils/oAuthHandler'
import { Tips } from './Tips'

const btnStyleMap = (btnColor?: string) => {
  const colorMap = {
    gray: 'hover:text-gray-600 dark:hover:text-white focus:ring-gray-200 focus:text-gray-600 dark:focus:text-white border-gray-300 dark:border-gray-500 dark:focus:ring-gray-500',
    blue: 'hover:text-blue-600 focus:ring-blue-200 focus:text-blue-600 border-blue-300 dark:border-blue-700 dark:focus:ring-blue-500',
    teal: 'hover:text-teal-600 focus:ring-teal-200 focus:text-teal-600 border-teal-300 dark:border-teal-700 dark:focus:ring-teal-500',
    red: 'hover:text-red-600 focus:ring-red-200 focus:text-red-600 border-red-300 dark:border-red-700 dark:focus:ring-red-500',
    green:
      'hover:text-green-600 focus:ring-green-200 focus:text-green-600 border-green-300 dark:border-green-700 dark:focus:ring-green-500',
    pink: 'hover:text-pink-600 focus:ring-pink-200 focus:text-pink-600 border-pink-300 dark:border-pink-700 dark:focus:ring-pink-500',
    yellow:
      'hover:text-yellow-400 focus:ring-yellow-100 focus:text-yellow-400 border-yellow-300 dark:border-yellow-400 dark:focus:ring-yellow-300',
  }

  if (btnColor) {
    return colorMap[btnColor]
  }

  return colorMap.gray
}

export const DownloadButton = ({
  onClickCallback,
  btnColor,
  btnText,
  btnIcon,
  btnImage,
  btnTitle,
}: {
  onClickCallback: MouseEventHandler<HTMLButtonElement>
  btnColor?: string
  btnText: string
  btnIcon?: IconProp
  btnImage?: string
  btnTitle?: string
}) => {
  return (
    <button
      className={`flex items-center space-x-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100/10 focus:z-10 focus:ring-2 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-900 ${btnStyleMap(
        btnColor
      )}`}
      title={btnTitle}
      onClick={onClickCallback}
    >
      {btnIcon && <FontAwesomeIcon icon={btnIcon} />}
      {btnImage && <Image src={btnImage} alt={btnImage} width={20} height={20} priority />}
      <span>{btnText}</span>
    </button>
  )
}

const DownloadButtonGroup = () => {
  const { asPath } = useRouter()
  const hashedToken = getStoredToken(asPath)

  const clipboard = useClipboard()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <PasswordProtected password={siteConfig?.downloadProtected?.password}>
      <CustomEmbedLinkMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} path={asPath} />
      <div className="flex flex-wrap justify-center gap-2">
        <DownloadButton
          onClickCallback={() => window.open(`/api/raw?path=${asPath}${hashedToken ? `&odpt=${hashedToken}` : ''}`)}
          btnColor="blue"
          btnText={'Download'}
          btnIcon="file-download"
          btnTitle={'Download the file directly through OneDrive'}
        />
        <DownloadButton
          onClickCallback={() => {
            clipboard.copy(`${getBaseUrl()}/api/raw?path=${asPath}${hashedToken ? `&odpt=${hashedToken}` : ''}`)
            toast.success('Copied direct link to clipboard.')
          }}
          btnColor="pink"
          btnText={'Copy direct link'}
          btnIcon="copy"
          btnTitle={'Copy the permalink to the file to the clipboard'}
        />
        <DownloadButton
          onClickCallback={() => setMenuOpen(true)}
          btnColor="teal"
          btnText={'Customise link'}
          btnIcon="pen"
        />
      </div>
    </PasswordProtected>
  )
}

export default DownloadButtonGroup

const PasswordProtected = ({ children, password }: { children: HTMLElement | any; password?: string }) => {
  const [input, setInput] = useState<string>()

  // -1上一次密码错误，0需要密码但未输入，1无需密码，2密码正确
  const [status, setStatus] = useState<number>(() => (!password?.length ? 1 : 0))
  let passwordError = [-1].includes(status)

  if ([1, 2].includes(status)) {
    return children
  }

  return (
    <div className={'flex flex-col text-center'}>
      <Tips mpname={siteConfig?.downloadProtected?.mpname}/>
      <div className={'flex w-full flex-row content-center space-x-2'}>
        <input
          value={input}
          className={`my-2 flex-1 rounded border bg-gray-50 p-2 font-mono text-sm font-medium focus:outline-none focus:ring dark:bg-gray-800 dark:text-white
           ${passwordError ? 'border-red-500/50 focus:ring-red-500/40' : ''}`}
          autoFocus
          type="text"
          placeholder="Password.."
          onChange={e => {
            setInput(e.target.value)
          }}
        />
        <button
          className={
            'rounded bg-blue-600 px-4 text-white hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-400'
          }
          onClick={() => setStatus(`${password}`.trim() === `${input}`.trim() ? 2 : -1)}
        >
          Confirm
        </button>
      </div>
    </div>
  )
}
