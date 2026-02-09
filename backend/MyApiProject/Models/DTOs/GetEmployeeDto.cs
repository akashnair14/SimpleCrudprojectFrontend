namespace MyApiProject.Models.DTOs
{
    public class GetEmployeeDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Department { get; set; }
        public decimal? Salary { get; set; }
    }

}
