import BankPromosLanding from '../components/BankPromosLanding.jsx'
import bankPromos from '../data/bankPromos.js'

function BankPromosPage() {
  return (
    <section className="panel">
      <BankPromosLanding promos={bankPromos} />
    </section>
  )
}

export default BankPromosPage
