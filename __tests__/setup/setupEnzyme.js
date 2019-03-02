import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

const config = require('../../config.json')

// Define paramters separately for jest, 
// as their values are not filled in with Webpack Define plugin

var WP_CONF_REMOTE_DB_URL = config.remote_db_url
var WP_CONF_BASE_URL = "/"