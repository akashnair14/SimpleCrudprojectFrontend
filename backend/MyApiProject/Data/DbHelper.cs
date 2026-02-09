using Microsoft.Data.SqlClient;

namespace MyApiProject.Data
{
    public class DbHelper
    {
        private readonly IConfiguration _config;

        public DbHelper(IConfiguration config)
        {
            _config = config;
        }

        public SqlConnection GetConnection()
        {
            string conn = _config.GetConnectionString("DefaultConnection");
            return new SqlConnection(conn);
        }
    }
}
