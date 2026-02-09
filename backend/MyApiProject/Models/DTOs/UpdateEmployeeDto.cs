using System.ComponentModel.DataAnnotations;

namespace MyApiProject.Models.DTOs
{
    public class UpdateEmployeeDto
    {
        public int Id { get; set; }
        required
        public string Name
        { get; set; }

        required
        public string Department
        { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Salary must be greater than zero.")]
        public decimal Salary { get; set; }
    }
}
