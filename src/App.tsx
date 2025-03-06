import { useState } from 'react'
import { useEnsAddress, useEnsName, useEnsAvatar, useEnsText } from 'wagmi'
import { normalize } from 'viem/ens'
import './App.css'

function App() {
  const [ensName, setEnsName] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [lookupType, setLookupType] = useState<'name' | 'address'>('name')

  // ENS name to address resolution
  const { data: address, isLoading: addressLoading, error: addressError } = useEnsAddress({
    name: lookupType === 'name' && ensName ? normalize(ensName) : undefined,
  })

  // ENS address to name resolution
  const { data: name, isLoading: nameLoading, error: nameError } = useEnsName({
    address: lookupType === 'address' && ensName ? ensName as `0x${string}` : undefined,
  })

  // Get ENS avatar
  const { data: avatar } = useEnsAvatar({
    name: lookupType === 'name' ? 
      (ensName ? normalize(ensName) : undefined) : 
      (name ? normalize(name) : undefined),
  })

  // Get common ENS text records
  const { data: twitter } = useEnsText({
    name: lookupType === 'name' ? 
      (ensName ? normalize(ensName) : undefined) : 
      (name ? normalize(name) : undefined),
    key: 'com.twitter',
  })

  const { data: discord } = useEnsText({
    name: lookupType === 'name' ? 
      (ensName ? normalize(ensName) : undefined) : 
      (name ? normalize(name) : undefined),
    key: 'com.discord',
  })

  const { data: url } = useEnsText({
    name: lookupType === 'name' ? 
      (ensName ? normalize(ensName) : undefined) : 
      (name ? normalize(name) : undefined),
    key: 'url',
  })

  const { data: email } = useEnsText({
    name: lookupType === 'name' ? 
      (ensName ? normalize(ensName) : undefined) : 
      (name ? normalize(name) : undefined),
    key: 'email',
  })

  const { data: description } = useEnsText({
    name: lookupType === 'name' ? 
      (ensName ? normalize(ensName) : undefined) : 
      (name ? normalize(name) : undefined),
    key: 'description',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEnsName(inputValue)
  }

  const isLoading = addressLoading || nameLoading
  const error = addressError || nameError

  return (
    <div className="app-container">
      <h1>ENS Domain Lookup</h1>
      <p className="description">
        Look up Ethereum Name Service (ENS) domains and view their associated records.
      </p>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-group">
          <select 
            value={lookupType} 
            onChange={(e) => setLookupType(e.target.value as 'name' | 'address')}
            className="select-input"
          >
            <option value="name">ENS Name</option>
            <option value="address">Ethereum Address</option>
          </select>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={lookupType === 'name' ? 'Enter ENS name (e.g., vitalik.eth)' : 'Enter Ethereum address (0x...)'}
            className="text-input"
          />
        </div>
        <button type="submit" className="search-button">Lookup</button>
      </form>

      {isLoading && <div className="loading">Loading...</div>}
      
      {error && (
        <div className="error">
          Error: {error.message || 'Failed to resolve ENS name or address'}
        </div>
      )}

      {!isLoading && !error && ensName && (
        <div className="results-container">
          <h2>ENS Profile</h2>
          
          {avatar && (
            <div className="avatar-container">
              <img src={avatar} alt="ENS Avatar" className="avatar" />
            </div>
          )}

          <div className="profile-details">
            {lookupType === 'name' ? (
              <>
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{ensName}</span>
                </div>
                {address && (
                  <div className="detail-row">
                    <span className="label">Address:</span>
                    <span className="value address">{address}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="detail-row">
                  <span className="label">Address:</span>
                  <span className="value address">{ensName}</span>
                </div>
                {name && (
                  <div className="detail-row">
                    <span className="label">Name:</span>
                    <span className="value">{name}</span>
                  </div>
                )}
              </>
            )}

            <h3>Text Records</h3>
            
            {description && (
              <div className="detail-row">
                <span className="label">Description:</span>
                <span className="value">{description}</span>
              </div>
            )}
            
            {twitter && (
              <div className="detail-row">
                <span className="label">Twitter:</span>
                <span className="value">
                  <a href={`https://twitter.com/${twitter}`} target="_blank" rel="noopener noreferrer">
                    @{twitter}
                  </a>
                </span>
              </div>
            )}
            
            {discord && (
              <div className="detail-row">
                <span className="label">Discord:</span>
                <span className="value">{discord}</span>
              </div>
            )}
            
            {url && (
              <div className="detail-row">
                <span className="label">Website:</span>
                <span className="value">
                  <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                </span>
              </div>
            )}
            
            {email && (
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">
                  <a href={`mailto:${email}`}>{email}</a>
                </span>
              </div>
            )}

            {!twitter && !discord && !url && !email && !description && (
              <div className="no-records">No text records found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
