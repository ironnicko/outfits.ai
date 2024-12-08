output "frontend_url" {
  value = aws_lb.frontend_alb.dns_name
}

output "backend_url" {
  value = aws_lb.backend_alb.dns_name
}
