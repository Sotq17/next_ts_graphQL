import type { NextPage } from 'next'
import { useMutation, useQuery } from '@apollo/client'
import { css } from '@emotion/react'
import { useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import { CREATE_ISSUE, GET_REPOSITORY } from '../../graphQL'
import { Repository } from '../../types'
import dynamic from 'next/dynamic'
import { Layout } from '../../components/layout/Layout'
import { RepoItem } from '../../components/block/RepoItem'
import { useModal } from '../../components/module/modal/useModal'
import { FixedModal } from '../../components/module/modal/FixedModal'
import { Button } from '../../components/atom/Button'
import { Close } from '../../components/atom/Close'
import { IssueItem } from '../../components/block/IssueItem'
import { mediaPc } from '../../style/variables'

const FixedSpinner = dynamic(
  () => import('../../components/block/FixedSpinner'),
  {
    ssr: false,
  }
)

type SubmitProps = {
  id: string
  title: string
  body: string
}

const Detail: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { loading, error, data, refetch } = useQuery(GET_REPOSITORY, {
    variables: { id: id },
  })
  const repo: Repository = data?.node
  console.log(data)

  const [issueTitle, setIssueTitle] = useState('')
  const [issueContent, setIssueContent] = useState('')

  const [createIssue] = useMutation(CREATE_ISSUE, {
    onCompleted() {
      refetch()
    },
  })

  // modal表示用
  const { isShowing, toggle } = useModal()

  const submitIssue = ({ id, title, body }: SubmitProps) => {
    createIssue({
      variables: { id: id, title: title, body: body },
    })
    setIssueTitle('')
    setIssueContent('')
    toggle()
  }

  // if (error) return <p>Error: {JSON.stringify(error)}</p>

  return (
    <Layout>
      {loading && <FixedSpinner />}
      {isShowing && (
        <FixedModal>
          <div css={modalContainer}>
            <button onClick={toggle} css={closeButton}>
              <Close />
            </button>

            <div css={modalFormBox}>
              <input
                type='text'
                value={issueTitle}
                placeholder='issue title'
                onChange={e => {
                  setIssueTitle(e.target.value)
                }}
              />
              <textarea
                value={issueContent}
                placeholder='issue body'
                onChange={e => {
                  setIssueContent(e.target.value)
                }}
              />

              <div css={modalButtonContainer}>
                <Button
                  text='Submit'
                  func={() =>
                    submitIssue({
                      id: repo.id,
                      title: issueTitle,
                      body: issueContent,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </FixedModal>
      )}

      {repo && (
        <div css={detailContainer}>
          <div css={repoItemContainer}>
            <RepoItem
              data={repo}
              refetch={refetch}
              linkText='Home'
              linkHref='/'
            />
          </div>

          <div css={issuesContainer}>
            <div css={buttonContainer}>
              <Button text='New Issue' func={toggle} />
            </div>
            <ul css={issueList}>
              {repo.issues?.edges?.map((issue, index) => {
                return (
                  <li css={issueItemContainer} key={index}>
                    <IssueItem node={issue.node} />
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Detail

const detailContainer = css`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 830px;
`

const modalButtonContainer = css`
  width: 280px;
  margin: auto;
`

const buttonContainer = css`
  width: 200px;
  margin: 0 auto 30px;
`

const repoItemContainer = css`
  height: 100%;
  max-width: 100%;
  margin: 0 auto 40px;
  ${mediaPc} {
    margin: 0 0 40px;
  }
`

const issuesContainer = css`
  width: 320px;
  margin: auto;
  ${mediaPc} {
    margin: 0;
  }
`
const issueList = css``

const issueItemContainer = css`
  margin-bottom: 30px;
  &:last-of-type {
    margin-bottom: 0px;
  }
`

const modalContainer = css`
  width: 280px;
  margin: auto;
  background: #ffffff;
  border-radius: 10px;
  padding: 20px 20px 40px;
  ${mediaPc} {
    width: 500px;
    padding: 30px 30px 40px;
  }
`
const closeButton = css`
  border: none;
  background: #ffffff;
  cursor: pointer;
  margin: 0 0 0 auto;
  display: block;
`
// ちょっとサボる
const modalFormBox = css`
  margin: 20px 0 10px;
  display: flex;
  flex-direction: column;
  input {
    height: 40px;
    background: #f2f5f9;
    border: 1px solid #c7c7c7;
    box-sizing: border-box;
    border-radius: 6px;
    padding-left: 10px;
    max-width: 360px;
    margin-bottom: 20px;
  }
  textarea {
    height: 90px;
    background: #f2f5f9;
    border: 1px solid #c7c7c7;
    box-sizing: border-box;
    border-radius: 6px;
    padding-left: 10px;
    margin-bottom: 50px;
  }
`
