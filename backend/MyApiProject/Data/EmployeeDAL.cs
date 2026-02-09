using Microsoft.Data.SqlClient;
using MyApiProject.Models.DTOs;
using System.Data;

namespace MyApiProject.DataAccess
{
    public class EmployeeDAL
    {
        private readonly string _connectionString;

        public EmployeeDAL(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }

        // ------------------ GET WITH FILTER ------------------
        public List<GetEmployeeDto> GetEmployeeList(EmployeeFilterDto filter)
        {
            var employees = new List<GetEmployeeDto>();

            using (var con = new SqlConnection(_connectionString))
            using (var cmd = CreateCommand(con, "sp_GetEmployees"))
            {
                AddParam(cmd, "@Id", SqlDbType.Int, filter.Id);
                AddParam(cmd, "@Name", SqlDbType.NVarChar, filter.Name);
                AddParam(cmd, "@Department", SqlDbType.NVarChar, filter.Department);
                AddParam(cmd, "@Salary", SqlDbType.Decimal, filter.Salary);

                con.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                        employees.Add(MapGetDto(reader));
                }
            }

            return employees;
        }

        // ------------------ CREATE ------------------
        public int AddEmployee(AddEmployeeDto dto)
        {
            using (var con = new SqlConnection(_connectionString))
            using (var cmd = CreateCommand(con, "sp_AddEmployee"))
            {
                AddParam(cmd, "@Name", SqlDbType.NVarChar, dto.Name);
                AddParam(cmd, "@Department", SqlDbType.NVarChar, dto.Department);
                AddParam(cmd, "@Salary", SqlDbType.Decimal, dto.Salary);

                con.Open();
                return Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        // ------------------ UPDATE ------------------
        public void UpdateEmployee(UpdateEmployeeDto dto)
        {
            using (var con = new SqlConnection(_connectionString))
            using (var cmd = CreateCommand(con, "sp_UpdateEmployee"))
            {
                AddParam(cmd, "@Id", SqlDbType.Int, dto.Id);
                AddParam(cmd, "@Name", SqlDbType.NVarChar, dto.Name);
                AddParam(cmd, "@Department", SqlDbType.NVarChar, dto.Department);
                AddParam(cmd, "@Salary", SqlDbType.Decimal, dto.Salary);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        // ------------------ DELETE ------------------
        public void DeleteEmployee(DeleteEmployeeDto dto)
        {
            using (var con = new SqlConnection(_connectionString))
            using (var cmd = CreateCommand(con, "sp_DeleteEmployee"))
            {
                AddParam(cmd, "@Id", SqlDbType.Int, dto.Id);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        // ------------------ HELPERS ------------------

        private SqlCommand CreateCommand(SqlConnection con, string spName)
        {
            return new SqlCommand(spName, con)
            {
                CommandType = CommandType.StoredProcedure
            };
        }

        private void AddParam(SqlCommand cmd, string name, SqlDbType type, object? value)
        {
            var p = cmd.Parameters.Add(name, type);
            p.Value = value ?? DBNull.Value;
        }

        private GetEmployeeDto MapGetDto(SqlDataReader r)
        {
            return new GetEmployeeDto
            {
                Id = r["Id"] == DBNull.Value ? 0 : Convert.ToInt32(r["Id"]),
                Name = r["Name"]?.ToString() ?? "",
                Department = r["Department"]?.ToString() ?? "",
                Salary = r["Salary"] == DBNull.Value ? (decimal?)null : Convert.ToDecimal(r["Salary"])
            };
        }
    }
}
