using MyApiProject.DataAccess;
using MyApiProject.Models.DTOs;

namespace MyApiProject.Business
{
    public class EmployeeBL
    {
        private readonly EmployeeDAL _dal;

        public EmployeeBL(EmployeeDAL dal)
        {
            _dal = dal;
        }

        // ------------------ GET ------------------
        public List<GetEmployeeDto> GetEmployees(EmployeeFilterDto filter)
        {
            return _dal.GetEmployeeList(filter);
        }

        // ------------------ CREATE ------------------
        public int AddEmployee(AddEmployeeDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new ArgumentException("Name cannot be empty.");

            if (string.IsNullOrWhiteSpace(dto.Department))
                throw new ArgumentException("Department cannot be empty.");

            if (dto.Salary <= 0)
                throw new ArgumentException("Salary must be greater than zero.");

            return _dal.AddEmployee(dto);
        }

        // ------------------ UPDATE ------------------
        public void UpdateEmployee(UpdateEmployeeDto dto)
        {
            if (dto.Id <= 0)
                throw new ArgumentException("Invalid employee ID.");

            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new ArgumentException("Name cannot be empty.");

            if (string.IsNullOrWhiteSpace(dto.Department))
                throw new ArgumentException("Department cannot be empty.");

            if (dto.Salary <= 0)
                throw new ArgumentException("Salary must be greater than zero.");

            _dal.UpdateEmployee(dto);
        }

        // ------------------ DELETE ------------------
        public void DeleteEmployee(DeleteEmployeeDto dto)
        {
            if (dto.Id <= 0)
                throw new ArgumentException("Invalid employee ID.");

            _dal.DeleteEmployee(dto);
        }
    }
}
